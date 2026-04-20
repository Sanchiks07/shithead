<x-layout>
    <div class="auth-container">
        <h1>Login</h1>

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <input id="email" type="email" name="email" placeholder="Email" autofocus required>
            <input id="password" type="password" name="password" placeholder="Password" required>

            <button type="submit">Login</button>
        </form>
    </div>
</x-layout>