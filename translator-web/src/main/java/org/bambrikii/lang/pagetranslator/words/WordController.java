package org.bambrikii.lang.pagetranslator.words;

import org.bambrikii.lang.pagetranslator.orm.LangRepository;
import org.bambrikii.lang.pagetranslator.orm.Language;
import org.bambrikii.lang.pagetranslator.orm.Tag;
import org.bambrikii.lang.pagetranslator.orm.TagRepository;
import org.bambrikii.lang.pagetranslator.orm.Word;
import org.bambrikii.lang.pagetranslator.orm.WordRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * Created by Alexander Arakelyan on 06/04/18 23:20.
 */
@RestController
@RequestMapping("/words")
public class WordController {
    private final WordRepository wordRepository;
    private final LangRepository langRepository;
    private final WordConverter wordConverter;
    private final TagRepository tagRepository;

    public WordController(WordConverter wordConverter, LangRepository langRepository, WordRepository wordRepository, TagRepository tagRepository) {
        this.wordConverter = wordConverter;
        this.langRepository = langRepository;
        this.wordRepository = wordRepository;
        this.tagRepository = tagRepository;
    }

    @GetMapping
    @Transactional
    public ResponseEntity<Page<WordDto>> list(
            @RequestParam(required = false, defaultValue = "") String name,
            @RequestParam(defaultValue = "0") Integer pageNum,
            @RequestParam(defaultValue = "50") Integer pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String langCode
    ) {
        Language lang = langRepository.findByCode(langCode);
        Page<WordDto> page = wordRepository
                .findByNameLikeAndLang(
                        name,
                        lang,
                        PageRequest.of(pageNum, pageSize, Sort.by(sortBy)))
                .map(wordConverter::toClient);

        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    @Transactional
    public ResponseEntity<WordDto> retrieveById(@PathVariable Long id) {
        Optional<Word> wordOptional = wordRepository.findById(id);
        if (wordOptional.isEmpty()) {
            return null;
        }
        WordDto wordDto = wordConverter.toClient(wordOptional.get());
        return ResponseEntity.ok(wordDto);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<WordDto> add(@RequestBody WordDto wordClient) {
        Word word = wordConverter.toPersistent(wordClient);
        wordRepository.save(word);

        WordDto result = wordConverter.toClient(word);

        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/{id}")
    @Transactional
    public ResponseEntity<WordDto> update(@PathVariable Long id, @RequestBody WordDto wordClient) {

        Word word = wordRepository.findById(id).get();
        Language lang = langRepository.findByCode(wordClient.getLangCode());
        word.setName(wordClient.getName());
        word.setLang(lang);
        wordRepository.save(word);

        WordDto result = wordConverter.toClient(word);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping(value = "/{id}")
    @Transactional
    public ResponseEntity<Boolean> remove(@PathVariable Long id) {
        wordRepository.delete(wordRepository.findById(id).get());
        return ResponseEntity.ok(Boolean.TRUE);
    }

    @PostMapping("/{wordId}/tags")
    @Transactional
    public WordDto addTag(@PathVariable Long wordId, @RequestBody Long tagId) {
        Optional<Word> wordOptional = wordRepository.findById(wordId);
        if (wordOptional.isEmpty()) {
            return null;
        }
        Word word = wordOptional.get();
        Optional<Tag> tagOptional = tagRepository.findById(tagId);
        Tag tag = tagOptional.get();
        Language lang = word.getLang();
        if (!word.getTags().contains(tag)) {
            word.getTags().add(tag);
            wordRepository.save(word);
        }
        return wordConverter.toClient(word);
    }

    @PostMapping("/{wordId}/tags/by-name")
    @Transactional
    public WordDto addTag(@PathVariable Long wordId, @RequestBody TagDto tagDto) {
        String tagName = tagDto.getName();
        Optional<Word> wordOptional = wordRepository.findById(wordId);
        if (wordOptional.isEmpty()) {
            return null;
        }
        Word word = wordOptional.get();
        Language lang = word.getLang();
        if (word
                .getTags()
                .stream()
                .filter(tag -> tagName.equals(tag.getName()) && lang.equals(tag.getLang()))
                .findAny()
                .isEmpty()
        ) {
            Optional<Tag> tagOptional = tagRepository.findByNameAndLang(tagName, lang);
            Tag tag = tagOptional.isPresent()
                    ? tagOptional.get()
                    : createTag(tagName, lang);
            word.getTags().add(tag);
            wordRepository.save(word);
        }
        return wordConverter.toClient(word);
    }

    private Tag createTag(String tagName, Language lang) {
        Tag tag;
        tag = new Tag();
        tag.setName(tagName);
        tag.setLang(lang);
        tagRepository.save(tag);
        return tag;
    }

    @DeleteMapping("/{wordId}/tags")
    @Transactional
    public WordDto removeTag(@PathVariable Long wordId, @RequestBody Tag tagDto) {
        Optional<Word> wordOptional = wordRepository.findById(wordId);
        if (wordOptional.isEmpty()) {
            return null;
        }
        Word word = wordOptional.get();
        Optional<Tag> tagOptional = tagRepository.findById(tagDto.getId());
        if (tagOptional.isEmpty()) {
            return null;
        }
        Tag tag = tagOptional.get();
        word.getTags().remove(tag);
        wordRepository.save(word);
        return wordConverter.toClient(word);
    }
}