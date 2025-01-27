document.addEventListener("DOMContentLoaded", function () {
	const sizeSlider = document.getElementById("sizeSlider");
	const sizeValue = document.getElementById("sizeValue");
	const lengthSlider = document.getElementById("lengthSlider");
	const lengthValue = document.getElementById("lengthValue");
	const dropCapFontSelect = document.getElementById("dropCapFontSelect");
	const paragraphFontSelect = document.getElementById("paragraphFontSelect");
	const dropCapColorPicker = document.getElementById("dropCapColorPicker");
	const paragraphColorPicker = document.getElementById("paragraphColorPicker");
	const paragraphCount = document.getElementById("paragraphCount");
	const generateButton = document.getElementById("generateText");
	const exportButton = document.getElementById("exportPDF");
	const textContainer = document.getElementById("textContainer");

	function generateLoremIpsum() {
		const words = [
			"lorem",
			"ipsum",
			"dolor",
			"sit",
			"amet",
			"consectetur",
			"adipiscing",
			"elit",
			"sed",
			"do",
			"eiusmod",
			"tempor",
			"incididunt",
			"ut",
			"labore",
			"et",
			"dolore",
			"magna",
			"aliqua",
			"enim",
			"ad",
			"minim",
			"veniam",
			"quis",
			"nostrud",
			"exercitation",
			"ullamco",
			"laboris",
			"nisi",
			"aliquip",
			"ex",
			"ea",
			"commodo",
			"consequat"
		];
		const length = parseInt(lengthSlider.value);
		let result = [];
		for (let i = 0; i < length; i++) {
			result.push(words[Math.floor(Math.random() * words.length)]);
		}
		result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
		return result.join(" ") + ".";
	}

	function updateDropCap(p) {
		const firstLetter = p.textContent.charAt(0);
		const restOfText = p.textContent.slice(1);
		p.innerHTML = `<span class="first-letter" style="
            float: left;
            font-size: ${sizeSlider.value}em;
            padding: 0.2rem;
            margin-right: 0.5rem;
            font-family: ${dropCapFontSelect.value};
            color: ${dropCapColorPicker.value};
            line-height: 0.8;
            font-weight: bold;
        ">${firstLetter}</span>${restOfText}`;
	}

	function generateText() {
		const count = parseInt(paragraphCount.value);
		let html = "";

		for (let i = 0; i < count; i++) {
			if (i % 4 === 0) {
				html += `<p class="drop-cap">${generateLoremIpsum()}</p>`;
			} else {
				html += `<p>${generateLoremIpsum()}</p>`;
			}
		}

		textContainer.innerHTML = html;
		const allParagraphs = textContainer.querySelectorAll("p");
		allParagraphs.forEach((p) => {
			p.style.fontFamily = paragraphFontSelect.value;
			p.style.color = paragraphColorPicker.value;
			if (p.classList.contains("drop-cap")) {
				updateDropCap(p);
			}
		});
	}

	[sizeSlider, lengthSlider].forEach((slider) => {
		slider.addEventListener("input", function () {
			const valueDisplay = this === sizeSlider ? sizeValue : lengthValue;
			valueDisplay.textContent = this.value;
			generateText();
		});
	});

	[dropCapFontSelect, dropCapColorPicker].forEach((element) =>
		element.addEventListener("change", function () {
			const dropCaps = textContainer.querySelectorAll(".drop-cap");
			dropCaps.forEach(updateDropCap);
		})
	);

	[paragraphFontSelect, paragraphColorPicker].forEach((element) =>
		element.addEventListener("change", function () {
			const paragraphs = textContainer.querySelectorAll("p");
			paragraphs.forEach((p) => {
				p.style.fontFamily = paragraphFontSelect.value;
				p.style.color = paragraphColorPicker.value;
			});
		})
	);

	paragraphCount.addEventListener("change", generateText);
	generateButton.addEventListener("click", generateText);

	exportButton.addEventListener("click", async () => {
		const opt = {
			margin: [25, 25, 25, 25],
			filename: "drop-cap-text.pdf",
			image: { type: "jpeg", quality: 1 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
			pagebreak: { mode: "avoid-all" }
		};

		try {
			await html2pdf().set(opt).from(textContainer).save();
		} catch (error) {
			console.error("PDF generation failed:", error);
		}
	});

	// Generate initial text
	generateText();
});
