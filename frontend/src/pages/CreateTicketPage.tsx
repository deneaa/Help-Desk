import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import {
  Categories,
  Priorities,
  TicketTypes,
  type Category,
  type Priority,
  type TicketType,
} from "../types/types";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface IForm {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  ticketType: TicketType;
}

const initialForm: IForm = {
  title: "",
  description: "",
  priority: "LOW",
  category: "IT",
  ticketType: "BUG",
};

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.description ||
      !formData.priority ||
      !formData.title
    ) {
      setError("Completeaza toate campurile");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      navigate(`/tickets/${data.id}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Create New Ticket</h2>
          <p className="text-gray-500">
            Fill out the form below to submit a new support ticket
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Ticket Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50 resize-none"
              placeholder="Provide detailed information about your issue..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label htmlFor="ticketType" className="block text-gray-700 mb-2">
                Type
              </label>
              <select
                id="ticketType"
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
              >
                {TicketTypes.map((tt) => (
                  <option key={tt} value={tt}>
                    {tt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
              >
                {Priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50"
              >
                {Categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Ticket
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="mt-6 bg-violet-50 rounded-2xl p-6 border border-violet-100">
        <h3 className="text-violet-900 mb-2">Tips for Better Support</h3>
        <ul className="space-y-2 text-violet-700 text-sm">
          <li>• Be specific and descriptive in your title</li>
          <li>• Include relevant details like error messages</li>
          <li>• Choose the appropriate priority level</li>
          <li>• Select the correct category for faster routing</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateTicketPage;
