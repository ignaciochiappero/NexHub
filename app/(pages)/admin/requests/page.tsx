"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from "next/link";

interface AchievementRequest {
  id: number;
  userId: number;
  logroId: number;
  step: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
  };
  logro: {
    title: string;
  };
}

export default function AchievementRequestsPage() {
  const [requests, setRequests] = useState<AchievementRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests");
      if (!response.ok) throw new Error("Error al obtener solicitudes");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error("Error al procesar la solicitud");

      // Update the local state
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        )
      );
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#242424] p-8 pt-28 font-[family-name:var(--blender-medium)]">
      
      <Link href="/admin/logros">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className=" text-white py-3 rounded-full transition-all flex items-center text-lg"
            >
              <ChevronLeft className="mr-2" size={24} />
            Volver
            </motion.button>
      </Link>
      
      
      <div className="max-w-6xl mx-auto mt-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-5xl text-white flex items-center">
            <AlertCircle className="mr-4 text-yellow-500" size={48} />
            Solicitudes de Logros
          </h1>
        </motion.div>

        {loading ? (
          <div className="grid gap-8">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div layout className="space-y-6">
            <AnimatePresence>
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#353535] p-6 rounded-xl shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">{request.logro.title}</h2>
                      <p className="text-gray-400">Paso {request.step} - Solicitado por {request.user.name}</p>
                    </div>
                    <div className="flex space-x-4">
                      {request.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
                          >
                            <Check className="mr-2" size={18} />
                            Aprobar
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center"
                          >
                            <X className="mr-2" size={18} />
                            Rechazar
                          </motion.button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-green-500 flex items-center">
                          <Check className="mr-2" size={18} />
                          Aprobado
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="text-red-500 flex items-center">
                          <X className="mr-2" size={18} />
                          Rechazado
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

