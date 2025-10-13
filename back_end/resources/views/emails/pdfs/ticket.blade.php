<!DOCTYPE html>
<html>
<head>
    <title>Billet Eventify</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        .ticket { border: 1px solid #000; padding: 20px; width: 500px; }
        h1 { text-align: center; }
        p { margin: 5px 0; }
        .qr { text-align: center; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="ticket">
        <h1>Billet Eventify</h1>
        <p><strong>Nom :</strong> {{ $ticket->user->prenom }} {{ $ticket->user->nom }}</p>
        <p><strong>Événement :</strong> {{ $ticket->evenement->title }}</p>
        <p><strong>Date :</strong> {{ \Carbon\Carbon::parse($ticket->evenement->date_fin)->format('d/m/Y H:i') }}</p>
        <p><strong>Lieu :</strong> {{ $ticket->evenement->lieu }}</p>
       <p><strong>Prix unitaire :</strong> {{ $ticket->amount }} MAD</p>
<p><strong>Quantité :</strong> {{ $ticket->quantity }}</p>
<p><strong>Montant total :</strong> {{ $ticket->amount * $ticket->quantity }} MAD</p>

        <div style="text-align:center; margin-top: 20px;">
    <h3>QR Code du billet</h3>
    <img src="{{ public_path('qrcodes/ticket-' . $ticket->id . '.png') }}" alt="QR Code" width="150">
</div>

    </div>
</body>
</html>
