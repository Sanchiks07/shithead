@auth
    <navigation>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/scoreboard">Scoreboard</a></li>

            <li>Welcome, {{ auth()->user()->name }}!</li>
            <li>
                <form method="POST" action="{{ route('logout') }}" class="logout-form">
                    @csrf
                    <button type="submit">Logout</button>
                </form>
            </li>
        </ul>
    </navigation>
@endauth