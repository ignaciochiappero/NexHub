//app/(pages)/admin/requests/page.tsx
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
    <div className="min-h-screen p-8 pt-20 font-[family-name:var(--blender-medium)]">
      <Link href="/admin/logros">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white py-3 rounded-xl transition-all flex items-center text-lg hover:text-pink-500"
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
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 flex items-center">
            <AlertCircle className="mr-4 text-pink-500" size={48} />
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
                className="bg-[#353535]/50 backdrop-blur-sm rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-[#404040] rounded-xl w-3/4 mb-4"></div>
                <div className="h-4 bg-[#404040] rounded-xl w-1/2"></div>
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
                  className="bg-[#353535]/50 backdrop-blur-sm p-6 rounded-xl shadow-lg
                           border border-gray-800 hover:border-pink-500/30 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">{request.logro.title}</h2>
                      <div className="flex items-center">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 
                                     text-pink-400 text-sm mr-3">
                          Paso {request.step}
                        </span>
                        <p className="text-gray-400">Solicitado por {request.user.name}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {request.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="bg-gradient-to-r from-pink-600 to-purple-600 
                                     hover:from-pink-700 hover:to-purple-700 text-white 
                                     px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-500/25 
                                     transition-all flex items-center"
                          >
                            <Check className="mr-2" size={18} />
                            Aprobar
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="bg-[#404040] hover:bg-[#454545] text-white 
                                     px-6 py-3 rounded-xl shadow-md transition-colors 
                                     flex items-center hover:text-red-500"
                          >
                            <X className="mr-2" size={18} />
                            Rechazar
                          </motion.button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <span className="text-pink-500 flex items-center px-4 py-2 
                                     bg-pink-500/10 rounded-xl">
                          <Check className="mr-2" size={18} />
                          Aprobado
                        </span>
                      )}
                      {request.status === 'rejected' && (
                        <span className="text-red-500 flex items-center px-4 py-2 
                                     bg-red-500/10 rounded-xl">
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