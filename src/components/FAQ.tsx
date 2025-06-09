import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
	{
		question: "What is Amplifilearn?",
		answer: "Amplifilearn is a modern learning management system designed to help students and educators manage courses, resources, and progress efficiently.",
	},
	{
		question: "How do I enroll in a course?",
		answer: "Browse the available courses, select the one you want, and click the enroll button. You may need to sign in or create an account first.",
	},
	{
		question: "Can I access my courses on mobile devices?",
		answer: "Yes, Amplifilearn is fully optimized for mobile devices, so you can learn anytime, anywhere.",
	},
	{
		question: "How do I access course resources?",
		answer: "Each course and chapter provides downloadable resources and materials. Click on the resource links to view or download them.",
	},
	{
		question: "Who do I contact for support?",
		answer: "If you need help, use the contact form or support email provided in the footer of the website.",
	},
];

const FAQ = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const handleToggle = (idx: number) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	return (
		<section className="container-custom">
			<h2 className="text-2xl font-bold mb-6 text-gray-800">
				Frequently Asked Questions
			</h2>
			<ul className="space-y-4">
				{faqs.map((faq, idx) => (
					<li key={idx} className="border-b last:border-b-0 pb-4">
						<button
							className="w-full flex justify-between items-center text-left focus:outline-none text-base font-medium text-foreground hover:text-primary transition-colors"
							onClick={() => handleToggle(idx)}
							aria-expanded={openIndex === idx}
						>
							<span>{faq.question}</span>
							{openIndex === idx ? (
								<ChevronUp className="h-6 w-6 text-primary" />
							) : (
								<ChevronDown className="h-6 w-6 text-primary" />
							)}
						</button>
						{openIndex === idx && (
							<div className="mt-3 text-gray-600 text-sm animate-fade-in">
								{faq.answer}
							</div>
						)}
					</li>
				))}
			</ul>
		</section>
	);
};

export default FAQ;