<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userRole = Role::firstOrCreate(
    ['name' => 'user'],
    ['display_name' => 'User', 'description' => 'Normal app user']
);
$organisateurRole = Role::firstOrCreate(
    ['name' => 'organisateur'],
    ['display_name' => 'organisateur', 'description' => 'organisateur user']
);
$adminRole = Role::firstOrCreate(
    ['name' => 'admin'],
    ['display_name' => 'Administrator', 'description' => 'Full access admin']
);

    }
}