<?php

namespace App\Mail;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Evenement;

class NewEventMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $evenement;

    public function __construct(Evenement $evenement)
    {
        $this->evenement = $evenement;
    }

    public function build()
    {
        $email = $this->subject(' Nouveau Événement : '.$this->evenement->title)
                      ->view('emails.new_event');

        if ($this->evenement->image && file_exists(public_path('storage/'.$this->evenement->image))) {
            $email->attach(public_path('storage/'.$this->evenement->image), [
                'as' => 'event_image.jpg',
                'mime' => 'image/jpeg',
            ]);
        }

        return $email;
    }
}

