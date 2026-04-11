import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Mail, Phone, MessageSquare, Send, ChevronLeft } from 'lucide-react';
import api from '../api/axios';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/contact', formData);

            alert('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

        } catch (err) {
            alert('Failed to send message');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />

            <div className="flex-1 px-6 py-6">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Contact Support
                        </h1>
                        <p className="text-sm text-gray-600">
                            Get in touch with our support team
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT SIDE - CONTACT INFO */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Contact Card */}
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-50 p-2 rounded-full">
                                        <Mail className="text-blue-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="text-sm font-medium text-gray-800">yashkadav52@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-green-50 p-2 rounded-full">
                                        <Phone className="text-green-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="text-sm font-medium text-gray-800">708814645</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-50 p-2 rounded-full">
                                        <MessageSquare className="text-purple-600" size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Support Hours</p>
                                        <p className="text-sm font-medium text-gray-800">Mon - Fri, 9am - 5pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Preview */}
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Answers</h3>

                            <div className="space-y-3">
                                <div className="border-b pb-2">
                                    <p className="text-sm font-medium text-gray-800">How do I reset my password?</p>
                                    <p className="text-xs text-gray-500 mt-1">Contact admin for password reset</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-sm font-medium text-gray-800">How do I report an issue?</p>
                                    <p className="text-xs text-gray-500 mt-1">Use the form below or email us</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Can I change my username?</p>
                                    <p className="text-xs text-gray-500 mt-1">No, usernames are permanent</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDE - CONTACT FORM */}
                    <div className="lg:col-span-2">

                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Us a Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Email"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Regarding quiz performance"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Type your message here..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send size={18} />
                                    Send Message
                                </button>

                            </form>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;