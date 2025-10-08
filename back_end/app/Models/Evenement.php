<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'title',
        'description',
        'date_debut',
        'date_fin',
        'lieu',
        'prix',
        'categorie',
        'organisateur_id',
        'views',
    ];

    public function organisateur()
    {
        return $this->belongsTo(User::class, 'organisateur_id');
    }
}
