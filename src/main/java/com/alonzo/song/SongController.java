package com.alonzo.song;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/alonzo")
@CrossOrigin(origins = {"https://song-ui-q24j.onrender.com", "http://localhost:5173"}, allowCredentials = "true")
public class SongController {

    @Autowired
    private SongRepository songRepository;

    @PostMapping(path = "/songs")
    public ResponseEntity<?> addSong(@RequestBody Song song) {
        try {
            Song savedSong = songRepository.save(song);
            return ResponseEntity.ok(savedSong);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding song: " + e.getMessage());
        }
    }

    @GetMapping(path = "/songs")
    public ResponseEntity<?> getAllSongs() {
        try {
            return ResponseEntity.ok(songRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching songs: " + e.getMessage());
        }
    }

    @GetMapping(path = "/songs/{id}")
    public ResponseEntity<?> getSong(@PathVariable Long id) {
        try {
            Optional<Song> song = songRepository.findById(id);
            if (song.isPresent()) {
                return ResponseEntity.ok(song.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Song with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching song: " + e.getMessage());
        }
    }

    @PutMapping(path = "/songs/{id}")
    public ResponseEntity<?> updateSong(@PathVariable Long id, @RequestBody Song song) {
        try {
            Song currentSong = songRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Song with ID " + id + " not found."));

            currentSong.setTitle(song.getTitle());
            currentSong.setArtist(song.getArtist());
            currentSong.setAlbum(song.getAlbum());
            currentSong.setGenre(song.getGenre());
            currentSong.setUrl(song.getUrl());

            currentSong = songRepository.save(currentSong);
            return ResponseEntity.ok(currentSong);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating song: " + e.getMessage());
        }
    }

    @DeleteMapping(path = "/songs/{id}")
    public ResponseEntity<?> deleteSong(@PathVariable Long id) {
        try {
            Optional<Song> song = songRepository.findById(id);
            if (song.isPresent()) {
                songRepository.deleteById(id);
                return ResponseEntity.ok("Song with ID " + id + " deleted.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Song with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting song: " + e.getMessage());
        }
    }

    @GetMapping(path = "/songs/search/{key}")
    public ResponseEntity<?> searchSong(@PathVariable String key) {
        try {
            Iterable<Song> results = songRepository
                    .findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCaseOrAlbumContainingIgnoreCaseOrGenreContainingIgnoreCase(
                            key, key, key, key);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error searching songs: " + e.getMessage());
        }
    }
}
