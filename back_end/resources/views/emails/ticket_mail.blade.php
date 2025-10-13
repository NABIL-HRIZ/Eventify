<h1>Merci pour votre achat !</h1>
<p>Votre billet pour {{ $ticket->evenement->title }} est disponible au format PDF.</p>
<p>
    <a href="{{ route('ticket.pdf', $ticket) }}" target="_blank">
        Voir votre billet
    </a>
</p>
<p>Si vous avez besoin d'aide, contactez Eventify.</p>
