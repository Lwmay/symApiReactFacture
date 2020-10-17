<?php


namespace App\Events;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        // récupérer l'utilisateur (pour avoir son firstname et last name)
        $user = $event->getUser();

        // enrichir les datas
        $data = $event->getData();  // c'est n tableau
        $data['firstName'] = $user->getFistName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}