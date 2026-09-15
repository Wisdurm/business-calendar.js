/*
 * BSD 3-Clause License
 *
 * Copyright (c) 2026, Wisdurm
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Calendar extends HTMLElement {
		// Squares, internal use
		#squares = [];
		// Title, internal use
		#title;
		// Last row, internal use
		#lastRow;
		#secondLastRow;
		// Year
		#year = (new Date()).getFullYear();
		get year() {
				return this.#year;
		}
		set year(x) {
				this.#year = x;
				this.#reindeer();
		}
		// Month
		#month = (new Date()).getMonth() + 1;
		get month() {
				return this.#month;
		}
		set month(x) {
				this.#month = x;
				this.#reindeer();
		}

		#weekmask = [true,true,true,true,true,false,false];
		get weekmask() {
				return this.#weekmask;
		}
		set weekmask(x) {
				this.#weekmask = x;
				this.#reindeer();
		}

		#holidays = [];
		get holidays() {
				return this.#holidays;
		}
		set holidays(x) {
				this.#holidays = x;
				this.#reindeer();
		}

		#start_date = null;
		get start_date() {
				return this.#start_date
		}
		set start_date(x) {
				this.#start_date = x;
				this.#reindeer();
		}

		#end_date = null;
		get end_date() {
				return this.#end_date
		}
		set end_date(x) {
				this.#end_date = x;
				this.#reindeer();
		}

		// Can be edited by user?
		editable = true;

		static daysInMonth(year, month) {
				return new Date(year, month, 0).getDate();
		}

		static pad(str) {
				return str.toString().length == 1 ? `0${str}` : str;
		}

		#reindeer() {
				// If not initialized yet, dont update
				if (!this.#title)
						return;

				const startDay = (new Date(this.#year, this.#month - 1, 0)).getDay();
				const days = Calendar.daysInMonth(this.#year, this.#month);
				this.#title.textContent = `Kalenteri (${Calendar.pad(this.#month)}.${this.#year})`;

				if (days + startDay == 28) {
						this.#secondLastRow.setAttribute("hidden", null);
				}	else {
						this.#secondLastRow.removeAttribute("hidden");
						if (days + startDay > 35) {
								this.#lastRow.removeAttribute("hidden");
						} else {
								this.#lastRow.setAttribute("hidden", null);
						}
				}

				this.#squares.forEach((div) => {
						// Day amount
						const id = parseInt(div.id);
						const day = id - startDay;
						if (day > days || day <= 0) {
								div.textContent = "";
								div.setAttribute("bgcolor", "#ffffff");
								return;
						} else {
								div.textContent = day;
						}
						// Is holiday
						const date = `${this.#year}-${Calendar.pad(this.#month)}-${Calendar.pad(day)}`;
						const weekday = (new Date(this.#year, this.#month - 1, day-1)).getDay();
						if (date == this.#start_date || date == this.#end_date) {
								div.setAttribute("bgcolor", "#ffff00");
						} else if (this.#holidays.includes(date) || !this.#weekmask[weekday]) {
								div.setAttribute("bgcolor", "#ff0000");
						} else if (this.#start_date != null && this.#end_date != null &&
											 date > this.#start_date && date < this.#end_date) {
								div.setAttribute("bgcolor", "#bbbbbb");
						} else {
								div.setAttribute("bgcolor", "#ffffff");
						}
				});
		}

		connectedCallback() {
				let _self = this;

				if(this.hasAttribute('year')) this.#year = this.getAttribute('year');
				if(this.hasAttribute('month')) this.#month = this.getAttribute('month');
				if(this.hasAttribute('weekmask')) this.#weekmask = JSON.parse(this.getAttribute('weekmask'));
				if(this.hasAttribute('holidays')) this.#holidays = JSON.parse(this.getAttribute('holidays'));
				if(this.hasAttribute('start_date')) this.#start_date = this.getAttribute('start_date');
				if(this.hasAttribute('end_date')) this.#end_date = this.getAttribute('end_date');
				if(this.hasAttribute('editable')) this.editable = JSON.parse(this.getAttribute('editable'));

				const cont = document.createElement("table");
				cont.setAttribute("bgcolor", "#000000");
				cont.setAttribute("border", "1");
				const t = document.createElement("font");
				t.textContent = `Kalenteri (${Calendar.pad(this.#month)}.${this.#year})`;
				t.setAttribute("color", "#ffffff");
				this.#title = t;
				cont.appendChild(t);

				const b1 = document.createElement("font");
				b1.setAttribute("color", "#ffffff");
				b1.textContent = "<-  ";
				b1.onclick = (function() {
						_self.#month--;
						if (_self.#month < 1) {
								_self.#month = 12;
								_self.#year--;
						}
						_self.#reindeer();
				});
				cont.appendChild(b1);

				const b2 = document.createElement("font");
				b2.setAttribute("color", "#ffffff");
				b2.textContent = "  ->";
				b2.onclick = (function() {
						_self.#month++;
						if (_self.#month > 12) {
								_self.#month = 1;
								_self.#year++;
						}
						_self.#reindeer();
				});
				cont.appendChild(b2);

				const table = document.createElement("table");
				table.setAttribute("bgcolor", "#ffffff");
				table.setAttribute("bordercolordark", "#000000");
				table.setAttribute("bordercolorlight", "#ffffff");
				table.setAttribute("border", "1");
				table.setAttribute("cellpadding", "5");
				for (let row = 0; row < 7; row++) {
						const rowDiv = document.createElement("tr");
						for (let col = 0; col < 7; col++) {
								const box = (row == 0) ? (() => {
										const b = document.createElement("th");
										b.setAttribute("bgcolor", "#000000");
										b.setAttribute("valign", "center");
										b.setAttribute("align", "center");
										const txt = document.createElement("font");
										txt.textContent = ["ma", "ti", "ke", "to", "pe", "la", "su"][col];
										txt.setAttribute("color", "#ffffff");
										b.appendChild(txt);
										return b;
								})() : (() => {
										const b = document.createElement("td");
										b.id = (col + (row-1)*7)+1;
										b.textContent = (col + (row-1)*7)+1;
										b.onclick = (function(e) {
												if (!_self.editable
														|| b.textContent == "") {
														return;
												}
												const day = b.textContent;
												const date = `${_self.#year}-${Calendar.pad(_self.#month)}-${Calendar.pad(day)}`;
												if (!e.shiftKey) {
														if (_self.#holidays.includes(date)) {
																const index = _self.#holidays.indexOf(date);
																_self.#holidays.splice(index, 1);
																_self.#reindeer();
														} else {
																_self.#holidays.push(date);
																b.setAttribute("bgcolor", "#ff0000");
														}
												} else {
														if (!_self.#start_date) {
																_self.#start_date = date;
														} else if (!_self.#end_date) {
																if (date < _self.start_date) {
																		_self.#end_date = _self.#start_date;
																		_self.#start_date = date;
																} else {
																		_self.#end_date = date;
																}
														} else {
																_self.#start_date = date;
																_self.#end_date = null;
														}
														_self.#reindeer();
												}
										});
										_self.#squares.push(b);
										return b;
								})();
								rowDiv.appendChild(box);
						}
						this.#secondLastRow = this.#lastRow;
						this.#lastRow = rowDiv;
						table.appendChild(rowDiv);
				}
				cont.appendChild(table);

				this.appendChild(cont);
				this.#reindeer();
		}

		static get observedAttributes() { return ['year', 'month', 'weekmask',
																							'holidays', 'start_date',
																							'end_date', 'editable']; }

		attributeChangedCallback(name, oldValue, newValue) {
				try {
						this[name] = JSON.parse(newValue);
				} catch (_) {
						this[name] = newValue;
				}
				this.#reindeer();
		}

}

customElements.define('calendar-component', Calendar);
