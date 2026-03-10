import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Success Modal Component
function BookingSuccessModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-6 py-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your booking request has been sent to the seller. They will contact you within 24 hours.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h5 className="font-semibold text-gray-900 mb-3">Booking Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{booking?.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-green-600">৳{booking?.productPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">{booking?.sellerName}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/my-bookings'}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Booking Modal Component
function BookingModal({ product, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    meetingLocation: '',
    meetingDate: '',
    meetingTime: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateStep1 = () => {
    if (!formData.phone || !formData.meetingLocation) {
      toast.error('Please fill in all required fields');
      return false;
    }
    const phoneRegex = /^(?:\+88|01)?(?:\d{9}|\d{10})$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid Bangladeshi phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);

    try {
      const bookingData = {
        productId: product._id,
        phone: formData.phone,
        meetingLocation: formData.meetingLocation,
        meetingDate: formData.meetingDate,
        meetingTime: formData.meetingTime,
        productName: product.name,
        productPrice: product.resalePrice,
        sellerName: product.seller?.name
      };

      await API.post('/bookings', bookingData);
      queryClient.invalidateQueries(['buyer-bookings']);
      
      toast.success('Booking request sent successfully!');
      
      
      setBookingResponse(bookingData);
      setIsSuccess(true);
      
      
      if (onSuccess) onSuccess(); 
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book product.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return <BookingSuccessModal booking={bookingResponse} onClose={onClose} />;
  }

  const suggestedLocations = [
    'Bashundhara Shopping Mall', 'Jamuna Future Park', 'Dhanmondi Lake', 
    'Gulshan 1 Circle', 'Banani 11', 'Uttara Sector 7', 'Mirpur 10', 
    'Farmgate', 'Motijheel', 'New Market'
  ];

  const getCurrentDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      minDate: tomorrow.toISOString().split('T')[0],
      minTime: '09:00'
    };
  };

  const { minDate, minTime } = getCurrentDateTime();

  const steps = [
    { number: 1, title: 'Details', description: 'Booking Information' },
    { number: 2, title: 'Review', description: 'Confirm Details' },
    { number: 3, title: 'Complete', description: 'Success' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h4>
              <p className="text-gray-600 text-sm">We'll use this to coordinate with the seller</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={currentUser?.displayName || 'User'} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" disabled />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={currentUser?.email || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" disabled />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Preferred Meeting Location <span className="text-red-500">*</span></label>
              <input type="text" name="meetingLocation" value={formData.meetingLocation} onChange={handleChange} placeholder="Enter meeting location" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required list="suggested-locations" />
              <datalist id="suggested-locations">
                {suggestedLocations.map((location, index) => <option key={index} value={location} />)}
              </datalist>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <input type="date" name="meetingDate" value={formData.meetingDate} onChange={handleChange} min={minDate} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <input type="time" name="meetingTime" value={formData.meetingTime} onChange={handleChange} min={minTime} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Review Your Booking</h4>
              <p className="text-gray-600 text-sm">Please verify all information before confirming</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-start space-x-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 truncate">{product.name}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-primary">৳{product.resalePrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-4">
                <div className="flex justify-between"><span>Contact:</span><span className="font-medium">{formData.phone}</span></div>
                <div className="flex justify-between"><span>Location:</span><span className="font-medium">{formData.meetingLocation}</span></div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={loading ? undefined : onClose} />
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Book This Product</h3>
              <button onClick={onClose} disabled={loading} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {currentStep > step.number ? "✓" : step.number}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}`}>{step.title}</span>
                    </div>
                    {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-6">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              <div className="flex items-center justify-between pt-6 border-t mt-6">
                <div>{currentStep > 1 && <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50" disabled={loading}>Back</button>}</div>
                <div className="flex space-x-3">
                  <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50" disabled={loading}>Cancel</button>
                  {currentStep < 2 ? (
                    <button type="button" onClick={() => validateStep1() && setCurrentStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Continue</button>
                  ) : (
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50" disabled={loading}>
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { BookingSuccessModal };
export default BookingModal;