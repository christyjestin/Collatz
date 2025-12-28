import 'katex/dist/katex.min.css';
import './Info.css';
import { InlineMath, BlockMath } from 'react-katex';
import { useEffect } from 'react';

export default function Info() {
	// Scroll to section if the URL has an anchor tag
	useEffect(() => {
		const hash = window.location.hash.slice(1); // Remove the # prefix
		if (hash) {
			const element = document.getElementById(hash);
			if (element) {
				setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 0);
			}
		}
	}, []);

	return (
		<div className="info-container">
			<h1>The Collatz Conjecture</h1>
			<section>
				<h2>Formulation</h2>
				<p>
					The conjecture states that if you start with any positive integer and apply the following rule, then
					you'll eventually reach 1:
				</p>
				<ul>
					<li>For any odd number, multiply it by 3 and add 1.</li>
					<li>For any even number, divide it by 2.</li>
				</ul>
				<BlockMath
					math="f(n) = \begin{cases}
						3n + 1 & \text{if } n \equiv 1 \pmod{2} \\
						n / 2 & \text{if } n \equiv 0 \pmod{2}
					\end{cases}"
				/>
				The conjcture has not yet been proven. You can see some examples of the rule in action on here:{' '}
				<a href="/collatz/#/5">5</a>, <a href="/collatz/#/32">32</a>, and <a href="/collatz/#/349">349</a>.
				Here's the Wikipedia <a href="https://en.wikipedia.org/wiki/Collatz_conjecture">page</a>.
			</section>

			<section>
				<h2>Some Interesting Cases</h2>
				<p>
					Normally you might try to prove a theorem like this via{' '}
					<a href="https://en.wikipedia.org/wiki/Mathematical_induction">induction</a> where you reduce the
					current case to a case you've already proven (e.g. <InlineMath math="n = k + 1" /> to{' '}
					<InlineMath math="n = k" />
					), and then you additionally prove a base case (e.g. <InlineMath math="n = 0" />
					). Here's{' '}
					<a href="https://en.wikipedia.org/wiki/Mathematical_induction#Sum_of_consecutive_natural_numbers">
						an example
					</a>{' '}
					of this technique. This is difficult for the Collatz conjecture since the sequence can get larger —
					sometimes much, much larger — before eventually making its way back down to 1, so it's not obvious
					what the previous case should. There are some interesting cases we can look at though.
				</p>
				<ul>
					<li>
						<b>Powers of 2</b>: these just cleanly halve until you reach 1 (e.g.{' '}
						<a href="/collatz/#/4">4</a>, <a href="/collatz/#/64">64</a>,{' '}
						<a href="/collatz/#/65536">65536</a>).
					</li>
					<li>
						<b>Even Numbers</b>: these halve until you reach their largest odd divisor. Therefore it'd be
						sufficient to prove that the conjecture holds for odd numbers to prove that it holds for all
						positive integers (e.g. <a href="/collatz/#/44">44</a> → 11, <a href="/collatz/#/80">80</a> → 5,{' '}
						<a href="/collatz/#/196608">196608</a> → 3).
					</li>
					<li>
						<b>Geometric Series with a Common Ratio of 4</b>: these are the only odd numbers that
						immediately become a power of 2 after applying the 3n + 1 rule, and it's easy to see why when we
						use the{' '}
						<a href="https://flexbooks.ck12.org/cbook/ck-12-precalculus-concepts-2.0/section/12.5/primary/lesson/geometric-series-pcalc/">
							formula
						</a>{' '}
						for finite sums of geometric series (e.g. 1 + 4 + 16 = <a href="/collatz/#/21">21</a>, 1 + 4 +
						16 + 64 = <a href="/collatz/#/85">85</a>, 1 + ⋅⋅⋅ + 1024 = <a href="/collatz/#/1365">1365</a>).
						<BlockMath math="a_n = \sum_{i=0}^{n}{4^i} = 1 + 4 + 16 + \cdots + 4^{n} = \frac{4^{n + 1} - 1}{3}" />
					</li>
				</ul>
				There are some more complicated odd number cases that relate to this geometric series case, but it's
				hard to come up with a general formulation captures all odd numbers.
			</section>

			<section>
				<h2 id="visualizer-info">The Visualizer</h2>
				The binary representation in the <a href="/collatz/#/">visualizer</a> gives us a better idea of what's
				going on here. In the even case, we tear off a few zeroes from the end of the number. In the odd case,
				we can say that <InlineMath math="3n + 1 = (2n + 1) + n." /> In binary, doubling the number and adding 1
				means shifting it left by one position and then tacking on a 1 to the end. Then we just add the original
				number.
				<br />
				<br />
				Lastly, here's some data analysis I did on the dynamics of Collatz sequences:{' '}
				<a href="https://x.com/christyjestin/status/2004682306649469255?s=20">Tweet #1</a>,{' '}
				<a href="https://x.com/christyjestin/status/2004759229278912663?s=20">Tweet #2</a>.
			</section>
		</div>
	);
}
