import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Animated, Dimensions, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const cardImages = [
  require('./assets/naipe.jpg'),
  require('./assets/corazones.png'),
  require('./assets/picas.png'),
  require('./assets/trebol.png'),
  require('./assets/carta10.png'),
  require('./assets/diamantes.png'),
  require('./assets/carta3.png'),
];

const logoImage = require('./assets/cartas.png');

const MemoryGame = () => {
  const [cards, setCards] = useState([true]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = () => {
    const initialCards = [];
    const totalCards = 6;
    for (let i = 0; i < totalCards; i++) {
      const imageIndex = Math.floor(Math.random() * cardImages.length);
      initialCards.push({ image: cardImages[imageIndex], id: i * 2 });
      initialCards.push({ image: cardImages[imageIndex], id: i * 2 + 1 });
    }
    initialCards.sort(() => Math.random() - 0.5);
    setCards(initialCards);
    setFlipped([]);
    setSolved([]);
    setAttempts(0);
    setGameCompleted("");
  };

  const handleCardPress = (cardId) => {
    if (flipped.length === 2 || solved.includes(cardId) || gameCompleted) return;
    setFlipped((prev) => [...prev, cardId]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      checkForMatch();
    }
  }, [flipped]);

  useEffect(() => {
    if (solved.length === cards.length) {
      setGameCompleted(true);
      const newScore = calculateScore();
      setScore(newScore);
      setShowWinnerModal(true);
    }
  }, [solved]);

  const calculateScore = () => {
    return 100 - attempts * 2;
  };

  const checkForMatch = () => {
    setAttempts((prev) => prev + 1);
    const [firstCard, secondCard] = flipped;
    if (cards[firstCard].image === cards[secondCard].image) {
      setSolved((prev) => [...prev, firstCard, secondCard]);
    }
    setTimeout(() => {
      setFlipped([]);
    }, 1000);
  };

  const renderCard = (index) => {
    const isFlipped = flipped.includes(index);
    const isSolved = solved.includes(index);
    const rotateY = isFlipped || isSolved ? '0deg' : '180deg';

    const animatedStyle = {
      transform: [{ rotateY: rotateY }],
    };

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleCardPress(index)}
        style={[styles.cardContainer, isSolved && styles.solvedCard]}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          {isFlipped || isSolved ? (
            <Image source={cards[index].image} style={styles.image} />
          ) : (
            <Image source={cardImages[0]} style={styles.image} />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const resetGame = () => {
    initializeCards();
    setLevel(1);
    setScore(0);
    setShowWinnerModal(false);
  };

  return (
    <LinearGradient colors={['#ff0000', '#0000ff']} style={styles.container}>
      <View style={styles.titleContainer}>
      <Image source={logoImage} style={styles.logoringht} />
        <Text style={styles.header}>Juego de Memoria</Text>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <View style={styles.levelScoreContainer}>
        <Text style={styles.levelScoreText}>Nivel: {level}</Text>
        <Text style={styles.levelScoreText}>Puntaje: {score}</Text>
      </View>
      <View style={styles.grid}>
        {cards.map((_, index) => renderCard(index))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showWinnerModal}
        onRequestClose={() => setShowWinnerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¡Felicidades! Has ganado en {attempts} intentos.</Text>
            <Button title="Reiniciar" onPress={resetGame} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  logoringht: {
    width: 40,
    height: 40,
    marginRight: 10,
    },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: windowWidth * 0.7,
    marginBottom: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    padding: 10,
  },
  levelScoreText: {
    fontSize: 18,
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth * 0.7,
    height: windowHeight * 0.7,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: windowWidth * 0.2,
    height: windowHeight * 0.15, 
    margin: 5,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'visible',
    borderRadius: 4,
  },
  image: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  solvedCard: {
    opacity: 0.4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
  },
});

export default MemoryGame;