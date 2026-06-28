// Event System
const eventsList = document.getElementById('eventsList');

const gameEvents = [
    {
        name: "Raid Alert",
        chance: 0.05,
        execute: () => {
            const raidViewers = Math.floor(Math.random() * 200) + 50;
            gameState.currentViewers += raidViewers;
            gameState.followers += Math.floor(raidViewers * 0.1);
            
            addEvent(`🎉 You got raided by another streamer! +${raidViewers} viewers!`, 'success');
            showNotification(`Raid incoming! +${raidViewers} viewers!`, 'success');
            addStreamFeedMessage(`🎉 RAID! +${raidViewers} viewers!`);
        }
    },
    {
        name: "Subscriber Milestone",
        chance: 0.08,
        execute: () => {
            const subscribers = Math.floor(gameState.followers * 0.05);
            gameState.money += subscribers * 3;
            gameState.totalMoneyEarned += subscribers * 3;
            
            addEvent(`💎 ${subscribers} new subscribers! +$${subscribers * 3}`, 'success');
            addStreamFeedMessage(`💎 New subscribers joined!`);
        }
    },
    {
        name: "Viewer Complaint",
        chance: 0.1,
        execute: () => {
            gameState.reputation = Math.max(0, gameState.reputation - 5);
            gameState.currentViewers = Math.max(0, gameState.currentViewers - Math.floor(gameState.currentViewers * 0.1));
            
            addEvent('😠 Viewers are complaining about something...', 'warning');
            addStreamFeedMessage('😠 Chat is unhappy...');
        }
    },
    {
        name: "PC Crash",
        chance: 0.03,
        execute: () => {
            gameState.isStreaming = false;
            gameState.reputation = Math.max(0, gameState.reputation - 10);
            
            document.getElementById('startStreamBtn').disabled = false;
            document.getElementById('stopStreamBtn').disabled = true;
            
            addEvent('💥 PC crashed! Stream ended unexpectedly!', 'danger');
            addStreamFeedMessage('💥 CRASH! Stream went down!');
            showNotification('Oh no! Your PC crashed!', 'danger');
        }
    },
    {
        name: "Trending",
        chance: 0.06,
        execute: () => {
            const newViewers = Math.floor(Math.random() * 500) + 200;
            const newFollowers = Math.floor(newViewers * 0.15);
            
            gameState.currentViewers += newViewers;
            gameState.followers += newFollowers;
            gameState.reputation = Math.min(100, gameState.reputation + 10);
            
            addEvent(`🔥 You're trending! +${newViewers} viewers, +${newFollowers} followers!`, 'success');
            addStreamFeedMessage(`🔥 TRENDING! Stream going WILD!`);
            showNotification(`You're trending! This is huge!`, 'success');
        }
    },
    {
        name: "Connection Issues",
        chance: 0.07,
        execute: () => {
            gameState.currentViewers = Math.max(0, gameState.currentViewers - Math.floor(gameState.currentViewers * 0.2));
            gameState.reputation = Math.max(0, gameState.reputation - 3);
            
            addEvent('⚠️ Connection issues detected! Viewers are leaving...', 'warning');
            addStreamFeedMessage('⚠️ LAG! Connection unstable!');
        }
    },
    {
        name: "Collaboration Offer",
        chance: 0.04,
        execute: () => {
            if (gameState.followers >= 100) {
                const collab = Math.floor(Math.random() * 500) + 200;
                gameState.followers += collab;
                gameState.reputation = Math.min(100, gameState.reputation + 5);
                
                addEvent(`🤝 Another streamer wants to collaborate! +${collab} followers!`, 'success');
                addStreamFeedMessage(`🤝 Collab opportunity incoming!`);
            }
        }
    },
    {
        name: "Donation Spree",
        chance: 0.12,
        execute: () => {
            const spree = Math.floor(Math.random() * 500) + 100;
            gameState.money += spree;
            gameState.totalMoneyEarned += spree;
            gameState.reputation = Math.min(100, gameState.reputation + 2);
            
            addEvent(`💰 Donation spree! +$${spree}!`, 'success');
            addStreamFeedMessage(`💰 DONATIONS! Chat is generous!`);
        }
    },
    {
        name: "Community Event",
        chance: 0.05,
        execute: () => {
            const eventMoney = 300;
            const eventFollowers = 50;
            
            gameState.money += eventMoney;
            gameState.followers += eventFollowers;
            gameState.reputation = Math.min(100, gameState.reputation + 3);
            
            addEvent(`🎪 Community event started! +$${eventMoney} and +${eventFollowers} followers!`, 'success');
            addStreamFeedMessage(`🎪 Community event in progress!`);
        }
    },
];

function addEvent(text, type = 'success') {
    const event = {
        text: text,
        type: type,
        time: new Date().toLocaleTimeString(),
    };
    
    gameState.events.push(event);
    
    // Keep only last 50 events
    if (gameState.events.length > 50) {
        gameState.events.shift();
    }
}

// Event triggers during stream
function checkForEvents() {
    if (!gameState.isStreaming) return;
    
    gameEvents.forEach(event => {
        if (Math.random() < event.chance) {
            event.execute();
        }
    });
}

// Check events periodically during stream
setInterval(checkForEvents, 5000);
