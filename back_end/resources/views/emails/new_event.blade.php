<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Événement - {{ $evenement->title }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- HEADER -->
                    <tr>
                        <td style="background-color: #efe363; color: #fff; text-align: center; padding: 20px;">
                            <h1 style="margin: 0; font-size: 24px;"> Nouvel Événement Disponible !</h1>
                        </td>
                    </tr>

                    <!-- CONTENU PRINCIPAL -->
                    <tr>
                        <td style="padding: 20px; color: #333;">
                            <h2 style="margin-top: 0;">{{ $evenement->title }}</h2>
                            <p>{{ $evenement->description ?? 'Découvrez notre tout nouvel événement à ne pas manquer !' }}</p>

                            <p><strong> Dates :</strong> du 
                                <span>{{ \Carbon\Carbon::parse($evenement->date_debut)->format('d/m/Y H:i') }}</span> 
                                au 
                                <span>{{ \Carbon\Carbon::parse($evenement->date_fin)->format('d/m/Y H:i') }}</span>
                            </p>

                            <p><strong> Lieu :</strong> {{ $evenement->lieu }}</p>
                            <p><strong> Prix :</strong> {{ number_format($evenement->prix, 2) }} MAD</p>

                           @if($evenement->image)
    <div style="text-align:center; margin: 20px 0;">
        <img src="cid:event_image.jpg" alt="Image de l'événement" width="400" style="border-radius: 8px;">
    </div>
@endif


                            <div style="text-align: center; margin-top: 30px;">
