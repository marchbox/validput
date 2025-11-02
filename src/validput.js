/**
 * @typedef {(HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)} FormControl
 */

/**
 * @typedef {(
 *   | "badinput"
 *   | "customerror"
 *   | "patternmismatch"
 *   | "rangeoverflow"
 *   | "rangeunderflow"
 *   | "stepmismatch"
 *   | "toolong"
 *   | "tooshort"
 *   | "typemismatch"
 *   | "valid"
 *   | "valuemissing"
 * )} Validity 
 */

export class Validput extends HTMLOutputElement {
	static get observedAttributes() {
		return ["for", "validity", "reportby"];
	}

	/** @type {?FormControl} */
	#control;

	/** @type {!AbortController} */
	#abort = new AbortController();

	/**
	 * The associated form control element.
	 * @type {?FormControl}
	 * @readonly
	 */
	get control() {
		return this.#control;
	}

	/**
	 * The validites that the output element displays the validation message for.
	 * it’s a space-seperated list of strings that match the Constraint Validation
	 * API’s `ValidityState` keys, but in all-lower case.
   *
	 * @type {Validity=}
	 */
	validity = "";

	// TODO
	reportby;

	disconnectedCallback() {
		this.#abort.abort();
	}

	attributeChangedCallback(name) {
		switch (name) {
			case "for":
				this.#control = this.getRootNode().getElementById(this.htmlFor);
				this.#listenControlInvalid();
				break;
		}
	}

	#listenControlInvalid() {
		if (!this.#control) {
			return;
		}

		this.#control.addEventListener(
			"invalid",
			(evt) => {
				evt.preventDefault();
				if (!this.#control) {
					return;
				}
				this.value = this.#control.validationMessage;
			},
			{ signal: this.#abort.signal },
		);

		this.#control.addEventListener(
			"input",
			() => {
				this.value = "";
			},
			{ signal: this.#abort.signal },
		);
	}
}
