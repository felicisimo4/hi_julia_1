// Leaderboard management

import { USER_IDENTITIES } from './config.js';

class LeaderboardManager {
    constructor() {
        this.currentUser = null;
        this.scores = this.loadScores();
    }

    // Load scores from localStorage
    loadScores() {
        const saved = localStorage.getItem('leaderboard');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with default scores
        return {
            [USER_IDENTITIES.JULIA]: 0,
            [USER_IDENTITIES.MANNY]: 0,
            [USER_IDENTITIES.OTHER]: 0
        };
    }

    // Save scores to localStorage
    saveScores() {
        localStorage.setItem('leaderboard', JSON.stringify(this.scores));
    }

    // Get current user identity
    getCurrentUser() {
        if (this.currentUser) return this.currentUser;

        const saved = localStorage.getItem('userIdentity');
        if (saved) {
            this.currentUser = saved;
            return saved;
        }

        // Prompt user to identify themselves
        return this.promptUserIdentity();
    }

    // Prompt user to choose identity
    promptUserIdentity() {
        const message = "Who are you? 💕\n\n1️⃣ Girlfriend Julia\n2️⃣ Boyfriend Manny\n3️⃣ Other >:(";
        const choice = prompt(message + "\n\nEnter 1, 2, or 3:");

        let identity;
        switch(choice) {
            case '1':
                identity = USER_IDENTITIES.JULIA;
                break;
            case '2':
                identity = USER_IDENTITIES.MANNY;
                break;
            case '3':
            default:
                identity = USER_IDENTITIES.OTHER;
                break;
        }

        this.currentUser = identity;
        localStorage.setItem('userIdentity', identity);
        return identity;
    }

    // Update score for current user
    updateScore(newScore) {
        const user = this.getCurrentUser();

        // Only update if new score is higher
        if (newScore > this.scores[user]) {
            this.scores[user] = newScore;
            this.saveScores();
            return true; // Indicates new high score
        }
        return false;
    }

    // Get leaderboard entries sorted by score
    getLeaderboard() {
        const entries = Object.entries(this.scores).map(([name, score]) => ({
            name,
            score,
            isCurrent: name === this.currentUser
        }));

        // Sort by score descending
        entries.sort((a, b) => b.score - a.score);

        return entries;
    }

    // Render leaderboard HTML
    renderLeaderboard() {
        const leaderboard = this.getLeaderboard();
        const medals = ['🥇', '🥈', '🥉'];

        return leaderboard.map((entry, index) => {
            const medal = index < 3 ? medals[index] : '';
            const currentClass = entry.isCurrent ? 'current-user' : '';

            return `
                <div class="leaderboard-entry">
                    <span class="leaderboard-name ${currentClass}">
                        <span class="leaderboard-medal">${medal}</span>
                        ${entry.name}
                    </span>
                    <span class="leaderboard-score">${entry.score} 💕</span>
                </div>
            `;
        }).join('');
    }
}

export const leaderboard = new LeaderboardManager();
