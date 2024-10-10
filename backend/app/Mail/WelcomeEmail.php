<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    private User $user;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thanks for joining',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {

        $verificationUrl = url("/verify-email/{$this->user->id}/{$this->user->verification_token}");
        //$verificationUrl = 3;
        $number = 3;
        return new Content(

            view: 'email.welcome-email',
            with: [
                'verificationUrl' => $verificationUrl,
                'user' => $this->user,
                'number' => $number
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
