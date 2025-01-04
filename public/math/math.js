document.addEventListener('DOMContentLoaded', function() {
    const chapterSelect = document.getElementById('chapterSelect');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const chapters = document.querySelectorAll('.chapter');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    function showChapter(chapterNumber) {
        chapters.forEach(chapter => chapter.classList.remove('active'));
        const selectedChapter = document.getElementById(`chapter-${chapterNumber}`);
        if (selectedChapter) {
            selectedChapter.classList.add('active');
            selectedChapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        updateButtons(chapterNumber);
    }

    function updateButtons(chapterNumber) {
        prevButton.disabled = chapterNumber === 1;
        nextButton.disabled = chapterNumber === 21;
    }

    chapterSelect.addEventListener('change', function() {
        const selectedChapter = this.value;
        if (selectedChapter) {
            showChapter(parseInt(selectedChapter));
        }
    });

    prevButton.addEventListener('click', function() {
        const currentChapter = parseInt(chapterSelect.value);
        if (currentChapter > 1) {
            showChapter(currentChapter - 1);
            chapterSelect.value = currentChapter - 1;
        }
    });

    nextButton.addEventListener('click', function() {
        const currentChapter = parseInt(chapterSelect.value);
        if (currentChapter > chapters.length) {
            showChapter(currentChapter + 1);
            chapterSelect.value = currentChapter + 1;
        }
    });

    menuToggle.addEventListener('click', function() {
        nav

Links.classList.toggle('active');
    });

    // Show the first chapter by default
    showChapter(1);
    chapterSelect.value = 1;
});
