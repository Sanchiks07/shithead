<x-layout>
    <div class="auth-container">
        <h1>Register</h1>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <input id="name" type="text" name="name" placeholder="Name" autofocus required />
            <input id="email" type="email" name="email" placeholder="Email" required />
            <input id="password" type="password" name="password" placeholder="Password" required />
            <input id="confirm_password" type="password" name="confirm_password" placeholder="Confirm password" required />

            <button type="submit">Register</button>
        </form>
    </div>
</x-layout>