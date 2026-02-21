<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_home_redirects_guests_to_login()
    {
        $response = $this->get(route('home'));

        $response->assertRedirect(route('login'));
    }
}
