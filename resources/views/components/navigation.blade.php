@auth
    <nav class="navigation">
        <div class="nav-left">
            <a href="/" class="{{ request()->is('/') ? 'active' : '' }}">Home</a>
            <a href="/game" class="{{ request()->is('game') ? 'active' : '' }}">Game</a>
            <a href="{{ route('leaderboard') }}" class="{{ request()->routeIs('leaderboard') ? 'active' : '' }}">
    Leaderboard
</a>
        </div>

        <div class="nav-right">
            <span>Welcome, {{ auth()->user()->name }}!</span>

            <form method="POST" action="{{ route('logout') }}" class="logout-form">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </nav>
@endauth