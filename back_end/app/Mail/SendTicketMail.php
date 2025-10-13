<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;


class SendTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function build()
    {
        
       $pdf = Pdf::loadView('emails.pdfs.ticket', ['ticket' => $this->ticket]);

    return $this->subject('Votre billet Eventify')
                ->view('emails.ticket') 
                ->with(['ticket' => $this->ticket])
                ->attachData($pdf->output(), 'ticket-' . $this->ticket->id . '.pdf', [
                    'mime' => 'application/pdf',
                ]);

    }
}
