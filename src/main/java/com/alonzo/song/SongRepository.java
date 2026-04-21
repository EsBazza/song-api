package com.alonzo.song;

import org.springframework.data.repository.CrudRepository;

public interface SongRepository extends CrudRepository<Song, Long> {

    Iterable<Song> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCaseOrAlbumContainingIgnoreCaseOrGenreContainingIgnoreCase(
            String title, String artist, String album, String genre);
}
