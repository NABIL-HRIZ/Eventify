<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Moddels\User;
use App\Moddels\Evenement;

class Ticket extends Model
{
    use HasFactory;

      protected $fillable = [
        'user_id',
        'evenement_id',
        'quantity',
        'amount',
    ];

     public function user() {
        return $this->belongsTo(User::class);
    }

    public function evenement() {
        return $this->belongsTo(Evenement::class);
    }
}
