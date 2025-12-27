import { useState, useEffect, useRef } from 'react';

import './Collatz.css';

const effectLag = 1000;

function Collatz() {
	const [inputNumber, setInputNumber] = useState('');
	const [number, setNumber] = useState(1);
	const [bits, setBits] = useState<string[]>(['1']);
	const [bitsTwo, setBitsTwo] = useState<string[]>([]);
	const [bitsThree, setBitsThree] = useState<string[]>([]);
	const [inFlux, setInFlux] = useState(false);
	const [boundingCount, setBoundingCount] = useState(0);
	const [speed, setSpeed] = useState(1);
	const [skipHalvings, setSkipHalvings] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// Allow only positive integers or the empty string
		if (value === '' || /^\d+$/.test(value)) {
			setInputNumber(value);
		}
	};

	const handleSubmit = () => {
		if (inputNumber === '') return;

		// The callbacks go haywire if one sequence is already in progress, so we don't support this case.
		if (inFlux) {
			const message =
				'Please wait for the current sequence to finish or reload the page to run with a new value.';
			alert(message);
			return;
		}

		setInFlux(true);
		const n = parseInt(inputNumber, 10);
		setNumber(n);
		const bin = n.toString(2);
		setBits(bin.split(''));
	};

	const speedRef = useRef(speed);
	const skipHalvingsRef = useRef(skipHalvings);

	// Keep refs in sync with states
	useEffect(() => {
		speedRef.current = speed;
	}, [speed]);
	useEffect(() => {
		skipHalvingsRef.current = skipHalvings;
	}, [skipHalvings]);

	// Callbacks to handle next steps in the Collatz sequence.
	useEffect(() => {
		setTimeout(() => nextCollatz(), effectLag / speedRef.current);
	}, [number]);

	useEffect(() => {
		setTimeout(() => nextAdd(1, 0), effectLag / speedRef.current);
	}, [bitsTwo]);

	const nextCollatz = () => {
		if (number === 1) {
			setInFlux(false);
			return;
		}
		if (number % 2 === 1) {
			setBits([...bits, '1']);
			setBitsTwo(bits);
			setBoundingCount(bits.length);
			// The nextAdd and finishAdd callbacks will handle the rest of the logic for this case.
		} else {
			let n = number / 2;
            // Skip through the halvings if the toggle is enabled.
			while (skipHalvingsRef.current && n % 2 === 0) {
				n = n / 2;
			}
			setNumber(n);
			const bin = n.toString(2);
			setBits(bin.split(''));
		}
	};

	const nextAdd = (index: number, carry: number) => {
		// do nothing on resets
		if (bitsTwo.length === 0) return;

		const a = index > bits.length ? 0 : parseInt(bits[bits.length - index]);
		const b = index > bitsTwo.length ? 0 : parseInt(bitsTwo[bitsTwo.length - index]);
		const sum = a + b + carry;
		const newBit = sum % 2;
		const newCarry = Math.floor(sum / 2);
		setBitsThree((prevBits) => [newBit.toString(), ...prevBits]);

        // Set the next callback to either continue adding or wrap things up.
		if (index < bits.length || newCarry === 1) {
			setTimeout(() => nextAdd(index + 1, newCarry), effectLag / speedRef.current);
		} else {
			setTimeout(() => finishAdd(), effectLag / speedRef.current);
		}
	};

	const finishAdd = () => {
		const n = 3 * number + 1;
		setNumber(n);
		const bin = n.toString(2);
		setBits(bin.split(''));
		setBitsTwo([]);
		setBitsThree([]);
		setBoundingCount(0);
	};

	return (
		<div className="calc_box">
			<div className="calc_container">
				<input
					type="text"
					inputMode="numeric"
					className="calc_input"
					value={inputNumber}
					onChange={handleChange}
					placeholder="1"
				/>
				<button className="calc_button" onClick={handleSubmit}>
					&#9654;
				</button>
			</div>

			<div className="speed_toggle">
				<label>Skip Halvings </label>
				<div className="toggle_wrapper">
					<label className="switch">
						<input
							type="checkbox"
							className="speed_checkbox"
							checked={skipHalvings}
							onChange={(e) => setSkipHalvings(e.target.checked)}
						/>
						<span className="slider" />
					</label>
				</div>
				<label>{speed}x </label>
				<input
					type="range"
					className="speed_toggle_input"
					min="0.5"
					max="2"
					step="0.25"
					value={speed}
					onChange={(e) => setSpeed(parseFloat(e.target.value))}
				/>
			</div>

			<div className="bits_wrapper">
				<div className="number_display">{number}</div>
				<div className="bits_container">
					<div className="bits_row">
						{boundingCount > 0 && (
							<div
								className="bits_bbox"
								style={{
									// fixed sizes must match CSS .bit width/height and gap
									width: `${boundingCount * 40}px`,
									left: -4,
								}}
							/>
						)}
						{bits.map((b, i) => (
							<div key={i} className={`bit ${b === '1' ? 'bit-on' : 'bit-off'}`}>
								{b}
							</div>
						))}
					</div>
				</div>
			</div>

			{bitsTwo.length > 0 && (
				<div className="bits_wrapper">
					<div className="bits_container">
						<div className="bits_row">
							<div
								className="bits_bbox"
								style={{
									// fixed sizes must match CSS .bit width/height and gap
									width: `${boundingCount * 40}px`,
									left: -4,
								}}
							/>
							{bitsTwo.map((b, i) => (
								<div key={i} className={`bit ${b === '1' ? 'bit-on' : 'bit-off'}`}>
									{b}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{bitsThree.length > 0 && (
				<>
                    {/* Horizontal dividing line for addition */}
					<hr /> 
					<div className="bits_wrapper">
						<div className="bits_container">
							<div className="bits_row">
								{bitsThree.map((b, i) => (
									// Invert key cause we're adding new bits to the front now
									<div
										key={bitsThree.length - i}
										className={`bit ${b === '1' ? 'bit-on' : 'bit-off'}`}
									>
										{b}
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Collatz;
