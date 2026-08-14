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
		// Year
		#year = 2026;
		get year() {
				return this.#year;
		}
		set year(x) {
				this.#year = x;
				this.reindeer();
		}	
		// Month
		#month = 8 - 1;
		get month() {
				return this.month;
		}
		set month(x) {
				this.#month = x;
				this.reindeer();
		}

		#weekmask = "1111100";
		get weekmask() {
				return this.#weekmask;
		}
		set weekmask(x) {
				this.#weekmask = x;
				this.reindeer();
		}

		#holidays = [];
		get holidays() {
				return this.#holidays;
		}
		set holidays(x) {
				this.#holidays = x;
				this.reindeer();
		}
		
		#startDate = "9999-99-99";
		get startDate() {
				return this.#startDate
		}
		set startDate(x) {
				this.#startDate = x;
				this.reindeer();
		}
		
		#endDate = "0000-00-00";
		get endDate() {
				return this.#endDate
		}
		set endDate(x) {
				this.#endDate = x;
				this.reindeer();
		}

		static daysInMonth(year, month) {
				return new Date(year, month, 0).getDate();
		}

		static dateValue(date) {
				let year, month, day;
				[year, month, day] = date.split("-").map((x) => parseInt(x));
				return (year*365) + (month*30) + day;
		}
		
		#reindeer() {
				const startDay = (new Date(this.#year, this.#month, 0)).getDay();
				const days = Calendar.daysInMonth(this.#year, this.#month);
				this.#title.textContent = `Kalenteri (${this.#month+1}.${this.#year})`;

				if (days + startDay <= 35) {
						this.#lastRow.setAttribute("hidden", null);
				} else {
						this.#lastRow.removeAttribute("hidden");
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
						const date = `${this.#year}-${this.#month}-${day}`;
						const weekday = (new Date(this.#year, this.#month, day-1)).getDay();
						if (date == this.#startDate || date == this.#endDate) {
								div.setAttribute("bgcolor", "#ffff00");
						} else if (this.#holidays.includes(date) || this.#weekmask[weekday] == '0') {
								div.setAttribute("bgcolor", "#ff0000");
						} else if (Calendar.dateValue(date) > Calendar.dateValue(this.#startDate) && Calendar.dateValue(date) < Calendar.dateValue(this.#endDate)) {
								div.setAttribute("bgcolor", "#bbbbbb");
						} else {
								div.setAttribute("bgcolor", "#ffffff");
						}
				});
		}

		constructor() {
				super();
				const shadowRoot = this.attachShadow({mode: 'open'});
				let _self = this;

				const cont = document.createElement("table");
				cont.setAttribute("bgcolor", "#000000");
				cont.setAttribute("border", "1");
				const t = document.createElement("font");
				t.textContent = `Kalenteri (${this.#month}.${this.#year})`;
				t.setAttribute("color", "#ffffff");
				this.#title = t
				cont.appendChild(t);

				const b1 = document.createElement("font");
				b1.setAttribute("color", "#ffffff");
				b1.textContent = "<-  ";
				b1.onclick = (function() {
						_self.#month--;
						if (_self.#month < 0) {
								_self.#month = 11;
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
						if (_self.#month > 11) {
								_self.#month = 0;
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
												if (b.textContent == "") {
														return;
												}
												const day = b.textContent;
												const date = `${_self.#year}-${_self.#month}-${day}`;
												if (!e.altKey && !e.ctrlKey) {
														if (_self.#holidays.includes(date)) {
																const index = _self.#holidays.indexOf(date);
																_self.#holidays.splice(index, 1);
																_self.#reindeer();
														} else {
																_self.#holidays.push(date);
																b.setAttribute("bgcolor", "#ff0000");
														}
												} else {
														if (e.altKey) {
																_self.#startDate = date;
														}else {
																_self.#endDate = date;
														}
														_self.#reindeer();
												}
										});
										_self.#squares.push(b);
										return b;
								})();
								rowDiv.appendChild(box);
						}
						this.#lastRow = rowDiv;
						table.appendChild(rowDiv);
				}
				cont.appendChild(table);

				shadowRoot.appendChild(cont);
				this.#reindeer();
		}
}

customElements.define('calendar-component', Calendar);
