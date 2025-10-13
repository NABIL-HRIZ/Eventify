<?php

namespace App\Jobs;

use App\Mail\NewEventMail;
use App\Models\Evenement;
use App\Models\Subscribe;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendNewEventEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $evenement;

    public function __construct(Evenement $evenement)
    {
        $this->evenement = $evenement;
    }

    public function handle()
    {
        $subscribers = Subscribe::all();

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new NewEventMail($this->evenement));
        }
    }
}
