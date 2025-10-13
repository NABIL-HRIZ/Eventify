<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Evenement;

class Ticket extends Model
{
    use HasFactory;

            protected $fillable = [
                'user_id',
                'event_id',
                'quantity',
                'amount',
        ];

     public function user() {
        return $this->belongsTo(User::class);
    }

    public function evenement() {
        return $this->belongsTo(Evenement::class, 'event_id');
    }
}
