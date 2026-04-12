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

            <div className="flex-1 p-6 space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Contact Support
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            Get in touch with our team
                        </span>
                    </h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 px-4 py-2 border-[3px] border-black font-black text-xs uppercase
                               bg-white hover:bg-yellow-300 transition-colors
                               shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                               active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <ChevronLeft size={16} strokeWidth={3} />
                        Back
                    </button>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT — INFO */}
                    <div className="space-y-5">

                        {/* Contact Info Card */}
                        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3 mb-5">
                                Contact Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="border-[3px] border-black p-2 bg-yellow-300">
                                        <Mail size={16} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-500">Email</p>
                                        <p className="text-sm font-bold">yashkadav52@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="border-[3px] border-black p-2 bg-lime-300">
                                        <Phone size={16} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-500">Phone</p>
                                        <p className="text-sm font-bold">708814645</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="border-[3px] border-black p-2 bg-cyan-300">
                                        <MessageSquare size={16} strokeWidth={3} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-500">Support Hours</p>
                                        <p className="text-sm font-bold">Mon – Fri, 9am – 5pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — FORM */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-5">
                            <h3 className="font-black uppercase text-sm tracking-widest border-b-[4px] border-black pb-3">
                                Send Us a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Name & Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your full name"
                                            className="w-full px-4 py-2 border-[3px] border-black font-bold
                                                   focus:outline-none focus:bg-yellow-50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-2 border-[3px] border-black font-bold
                                                   focus:outline-none focus:bg-yellow-50 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Regarding quiz performance..."
                                        className="w-full px-4 py-2 border-[3px] border-black font-bold
                                               focus:outline-none focus:bg-yellow-50 transition-colors"
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Type your message here..."
                                        className="w-full px-4 py-3 border-[3px] border-black font-bold
                                               focus:outline-none focus:bg-yellow-50 transition-colors resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-lime-400 border-[3px] border-black
                                           font-black uppercase text-sm hover:bg-lime-500 transition-colors
                                           shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                           active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                >
                                    <Send size={16} strokeWidth={3} />
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