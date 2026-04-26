import { useState } from "react";
import { CharacterSelect } from "./components/CharacterSelect";
import { GameBoard } from "./components/GameBoard";
import { characters } from "./data/characters";

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const selectedCharacter = characters.find(
    (character) => character.id === selectedCharacterId,
  );

  if (selectedCharacter) {
    return (
      <GameBoard
        character={selectedCharacter}
        onBackToSelection={() => setSelectedCharacterId(null)}
      />
    );
  }

  return <CharacterSelect onStartGame={setSelectedCharacterId} />;
}
