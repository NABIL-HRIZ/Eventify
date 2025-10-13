<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;


class SendWelcomeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public User $user;

   public function __construct(User $user)
    {
        $this->user = $user;
    }

     public function build()
{
    return $this->subject('Bienvenue sur Eventify')
                ->html('<h1>Bienvenue, '.$this->user->prenom  . ' ' .  $this->user->nom.'</h1><p>Merci pour votre inscription </p>');
}

  
}