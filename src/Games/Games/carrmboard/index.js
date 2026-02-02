import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    BackHandler,
    Vibration,
    Dimensions,
} from 'react-native';
import { gamesColor } from '@/core/theme/GamesColor';
import { moderateScale, verticalScale } from '@/core/utils/responsive';
import InGameHeader from '@/Games/components/inGame/InGameHeader';
import InGamePlayerCard from '@/Games/components/inGame/InGamePlayerCard';
import InGameStatus from '@/Games/components/inGame/InGameStatus';
import WinCelebration from '@/Games/components/inGame/winCelebration';
import CustomAlert from '@/components/common/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import CarromBoard from './components/CarromBoard';

const CarromGame = ({ navigation, route }) => {
    const {
        entryFee = 50,
        prizePool = 90
    } = route.params || {};

    const [currentPlayer, setCurrentPlayer] = useState('white'); // 'white' or 'black'
    const [winner, setWinner] = useState(null);
    const [whiteScore, setWhiteScore] = useState(0);
    const [blackScore, setBlackScore] = useState(0);

    // Initial Coin positions (Center formation)
    const [coins, setCoins] = useState(() => {
        const { width } = Dimensions.get('window');
        // Matches CarromBoard.js layout logic
        const BOARD_SIZE = width - moderateScale(24);
        const PADDING = moderateScale(20);
        const SURFACE_SIZE = BOARD_SIZE - PADDING * 2;
        const center = SURFACE_SIZE / 2;

        // Adjust for Board component internal padding/margins if needed.
        // CarromBoard Surface is relative to Frame. Coins are rendered absolute in Surface.
        // Frame padding is 20. Surface is inside Frame. 
        // So (0,0) of Surface is Top-Left of playable area. Center is Surface/2.

        const coinRadius = moderateScale(12); // Half of width (24)

        const hexRadius = moderateScale(26); // Distance for first ring
        const hexRadius2 = moderateScale(52); // Distance for second ring

        // Exact coin definitions
        const fixedCoins = [
            { id: 0, color: 'queen', x: 0, y: 0 },
            // Inner Circle (6)
            { id: 1, color: 'white', x: hexRadius, y: 0 },
            { id: 2, color: 'black', x: hexRadius * 0.5, y: hexRadius * 0.866 },
            { id: 3, color: 'white', x: -hexRadius * 0.5, y: hexRadius * 0.866 },
            { id: 4, color: 'black', x: -hexRadius, y: 0 },
            { id: 5, color: 'white', x: -hexRadius * 0.5, y: -hexRadius * 0.866 },
            { id: 6, color: 'black', x: hexRadius * 0.5, y: -hexRadius * 0.866 },
            // Outer Circle (12)
            { id: 7, color: 'white', x: hexRadius * 2, y: 0 },
            { id: 8, color: 'black', x: hexRadius * 1.5, y: hexRadius * 0.866 },
            { id: 9, color: 'white', x: hexRadius * 1, y: hexRadius * 1.732 },
            { id: 10, color: 'black', x: 0, y: hexRadius * 2 },
            { id: 11, color: 'white', x: -hexRadius * 1, y: hexRadius * 1.732 },
            { id: 12, color: 'black', x: -hexRadius * 1.5, y: hexRadius * 0.866 },
            { id: 13, color: 'white', x: -hexRadius * 2, y: 0 },
            { id: 14, color: 'black', x: -hexRadius * 1.5, y: -hexRadius * 0.866 },
            { id: 15, color: 'white', x: -hexRadius * 1, y: -hexRadius * 1.732 },
            { id: 16, color: 'black', x: 0, y: -hexRadius * 2 },
            { id: 17, color: 'white', x: hexRadius * 1, y: -hexRadius * 1.732 },
            { id: 18, color: 'black', x: hexRadius * 1.5, y: -hexRadius * 0.866 },
        ];

        return fixedCoins.map(c => ({
            ...c,
            x: center + c.x - coinRadius,
            y: center + c.y - coinRadius,
            vx: 0,
            vy: 0,
            potted: false
        }));
    });

    // Alert states
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

    // Celebration state
    const [showCelebration, setShowCelebration] = useState(false);

    // --- PHYSICS ENGINE ---

    // Game Loop Reference
    const requestRef = React.useRef();
    const startTimeRef = React.useRef();
    const lastTimeRef = React.useRef();

    // Physics Constants
    const FRICTION = 0.985; // Deceleration per frame
    const WALL_DAMPING = 0.7; // Energy lost when hitting wall
    const COIN_DAMPING = 0.8; // Energy lost hitting other coins
    const STOP_THRESHOLD = 0.05;

    // Board Dimensions (must match CarromBoard.js)
    const { width } = Dimensions.get('window');
    const BOARD_SIZE = width - moderateScale(24);
    const PADDING = moderateScale(20);
    const SURFACE_SIZE = BOARD_SIZE - PADDING * 2; // ~300-350 depending on screen
    const COIN_RADIUS = moderateScale(12);

    // Update Physics State
    const animate = (time) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        // const deltaTime = time - lastTimeRef.current; // Use for frame-independent if needed
        lastTimeRef.current = time;

        setCoins(prevCoins => {
            let nextCoins = [...prevCoins];
            let moving = false;

            // 1. Move & Wall Collisions
            nextCoins = nextCoins.map(c => {
                if (c.potted) return c;
                if (Math.abs(c.vx) < STOP_THRESHOLD && Math.abs(c.vy) < STOP_THRESHOLD) {
                    return { ...c, vx: 0, vy: 0 };
                }

                moving = true;
                let { x, y, vx, vy } = c;

                // Apply Velocity
                x += vx;
                y += vy;

                // Apply Friction
                vx *= FRICTION;
                vy *= FRICTION;

                // Wall Collisions
                // Left
                if (x < COIN_RADIUS) {
                    x = COIN_RADIUS;
                    vx = -vx * WALL_DAMPING;
                }
                // Right
                if (x > SURFACE_SIZE - COIN_RADIUS) {
                    x = SURFACE_SIZE - COIN_RADIUS;
                    vx = -vx * WALL_DAMPING;
                }
                // Top
                if (y < COIN_RADIUS) {
                    y = COIN_RADIUS;
                    vy = -vy * WALL_DAMPING;
                }
                // Bottom
                if (y > SURFACE_SIZE - COIN_RADIUS) {
                    y = SURFACE_SIZE - COIN_RADIUS;
                    vy = -vy * WALL_DAMPING;
                }

                return { ...c, x, y, vx, vy };
            });

            // 2. Coin-Coin Collisions (Naive O(N^2))
            for (let i = 0; i < nextCoins.length; i++) {
                if (nextCoins[i].potted) continue;
                for (let j = i + 1; j < nextCoins.length; j++) {
                    if (nextCoins[j].potted) continue;

                    const c1 = nextCoins[i];
                    const c2 = nextCoins[j];

                    const dx = c2.x - c1.x;
                    const dy = c2.y - c1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < COIN_RADIUS * 2) {
                        // Collision Detected
                        // Normalize normal vector
                        const nx = dx / dist;
                        const ny = dy / dist;

                        // Relative velocity
                        const dvx = c2.vx - c1.vx;
                        const dvy = c2.vy - c1.vy;

                        // Velocity along normal
                        const velAlongNormal = dvx * nx + dvy * ny;

                        // Do not resolve if moving apart
                        if (velAlongNormal > 0) continue;

                        // Elastic collision impulse
                        const restitution = 0.9; // Bounciness
                        const jVal = -(1 + restitution) * velAlongNormal;
                        // Assuming equal mass, jVal /= 2 (1/m1 + 1/m2)
                        const impulse = jVal / 2;

                        // Apply impulse
                        const impX = impulse * nx;
                        const impY = impulse * ny;

                        // Update velocities (Dumping factor)
                        nextCoins[i].vx -= impX * COIN_DAMPING;
                        nextCoins[i].vy -= impY * COIN_DAMPING;
                        nextCoins[j].vx += impX * COIN_DAMPING;
                        nextCoins[j].vy += impY * COIN_DAMPING;

                        // Seperate circles to prevent sticking (Projection)
                        const overlap = COIN_RADIUS * 2 - dist;
                        const correction = overlap / 2;
                        nextCoins[i].x -= nx * correction;
                        nextCoins[i].y -= ny * correction;
                        nextCoins[j].x += nx * correction;
                        nextCoins[j].y += ny * correction;

                        moving = true; // Still active interactions

                        // Haptic feedback for collision (throttle this in real app)
                        // Vibration.vibrate(5); 
                    }
                }
            }

            // 3. Potting
            // Pocket coords (approximate centers based on logic)
            const POCKET_RADIUS = moderateScale(18); // Slightly larger than coin
            const pockets = [
                { x: 0, y: 0 },
                { x: SURFACE_SIZE, y: 0 },
                { x: 0, y: SURFACE_SIZE },
                { x: SURFACE_SIZE, y: SURFACE_SIZE }
            ];

            let pottedAny = false;
            nextCoins = nextCoins.map(c => {
                if (c.potted) return c;
                for (let p of pockets) {
                    const pdx = c.x - p.x;
                    const pdy = c.y - p.y;
                    const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                    if (pDist < POCKET_RADIUS) {
                        // Potted!
                        pottedAny = true;
                        handlePot(c);
                        return { ...c, potted: true, vx: 0, vy: 0 };
                    }
                }
                return c;
            });

            if (moving) {
                requestRef.current = requestAnimationFrame(animate);
            } else {
                // Turn Over Logic if purely stopped? 
                // We handle turn switch in handleStrike generally, but here we wait for stability.
                // For now, let's keep it simple. Only switch turn if nothing potted after shot.
            }
            return nextCoins;
        });
    };

    const handlePot = (coin) => {
        Vibration.vibrate(50);
        if (coin.color === 'white') setWhiteScore(s => s + 10);
        else if (coin.color === 'black') setBlackScore(s => s + 10);
        else if (coin.color === 'queen') {
            if (currentPlayer === 'white') setWhiteScore(s => s + 50);
            else setBlackScore(s => s + 50);
        }
    };


    const handleStrike = (strikeData) => {
        if (winner) return;

        // Convert Striker Position to Surface Coords
        // strikerX is -42% to 42%. 
        // Surface center is SURFACE_SIZE/2. 
        // track width is basically SURFACE_SIZE. 
        // strikex=0 -> x=center.
        const center = SURFACE_SIZE / 2;
        const strikerRealX = center + (strikeData.startX / 100 * SURFACE_SIZE);

        // Y position: 
        // Bottom track: near SURFACE_SIZE. Top track: near 0.
        // Let's assume we spawn a "Striker Coin" and shoot it.
        // But for simplicity, let's just apply force to the coins directly if they are close?
        // NO, we need a Striker physics object.

        // Simulating the Striker as a temporary physics object or just launching a Raycast?
        // "Game sketer se playable bnao". Striker must physically hit coins.

        // Let's Add a "Striker" coin to the coins array temporarily!

        const strikerY = currentPlayer === 'white' ? SURFACE_SIZE - moderateScale(42) : moderateScale(42);

        // Create Striker Object
        const strikerObj = {
            id: 'striker',
            color: 'striker', // specialized
            x: strikerRealX,
            y: strikerY,
            vx: strikeData.vx || 0,
            vy: strikeData.vy || 0,
            potted: false,
            isStriker: true // Flag to remove later
        };

        setCoins(prev => [...prev, strikerObj]);

        // Start Loop
        requestRef.current = requestAnimationFrame(animate);

        // Cleanup Striker after delay (simulating it returns)
        setTimeout(() => {
            setCoins(prev => prev.filter(c => c.id !== 'striker'));
            // Switch turn logic can go here if we track 'pottedAny'
            setCurrentPlayer(prev => prev === 'white' ? 'black' : 'white');
        }, 5000);
    };

    // Check Winner
    useEffect(() => {
        const remainingCoins = coins.filter(c => !c.potted);
        if (remainingCoins.length === 0) {
            // Game Over
            if (whiteScore > blackScore) setWinner('white');
            else if (blackScore > whiteScore) setWinner('black');
            else setWinner('draw');

            setShowCelebration(true);
        }
    }, [coins, whiteScore, blackScore]);

    const resetGame = () => {
        setWhiteScore(0);
        setBlackScore(0);
        setCurrentPlayer('white');
        setWinner(null);
        setShowCelebration(false);
        setCoins(coins.map(c => ({ ...c, potted: false }))); // Reset pots
    };

    // Handle Hardware Back Press
    useEffect(() => {
        const backAction = () => {
            if (!winner && (whiteScore > 0 || blackScore > 0)) {
                setAlertConfig({
                    title: "Exit Game?",
                    message: "Game is in progress. Are you sure you want to quit?",
                    confirmText: "Yes, Exit",
                    cancelText: "Stay",
                    onConfirm: () => navigation.goBack(),
                    onCancel: () => setShowAlert(false)
                });
                setShowAlert(true);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [winner, whiteScore, blackScore, navigation]);


    const isWin = (winner === 'white' && currentPlayer === 'white') || (winner === 'black' && currentPlayer === 'black'); // Simplified logic for demo

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <InGameHeader entryFee={entryFee} />

                <InGameStatus winner={winner} isXNext={currentPlayer === 'white'} prizePool={prizePool} />

                <View style={styles.playersRow}>
                    <InGamePlayerCard
                        name="PLAYER 1"
                        symbol="W"
                        isActive={currentPlayer === 'white'}
                        isTurn={currentPlayer === 'white' && !winner}
                    />
                    <InGamePlayerCard
                        name="PLAYER 2"
                        symbol="B"
                        isActive={currentPlayer === 'black'}
                        isTurn={currentPlayer === 'black' && !winner}
                    />
                </View>

                <CarromBoard
                    coins={coins}
                    striker={{}}
                    onStrike={handleStrike}
                    currentPlayer={currentPlayer}
                />

            </View>

            {/* Back Press Alert */}
            <CustomAlert
                visible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                cancelText={alertConfig.cancelText}
                onConfirm={alertConfig.onConfirm}
                onCancel={alertConfig.onCancel}
                showCancel={true}
                onClose={() => setShowAlert(false)}
            />

            {/* Win/Loss Celebration */}
            <WinCelebration
                visible={showCelebration}
                amount={prizePool}
                isWinner={true} // For demo, always show winner view
                onNewGame={resetGame}
                onQuit={() => navigation.goBack()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gamesColor.background,
    },
    content: {
        flex: 1,
        paddingBottom: verticalScale(20),
    },
    playersRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});

export default CarromGame;
