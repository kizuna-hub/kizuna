import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const AIMatchCard = ({ matchText }: { matchText: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="h-24 w-24 text-kizuna-primary" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-base text-emerald-800 flex items-center gap-2 uppercase tracking-wider font-bold">
                    <Sparkles className="h-5 w-5" /> Độ phù hợp: 92%
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-kizuna-text-main font-medium relative z-10 leading-relaxed text-base italic">
                    "{matchText}"
                </p>
            </CardContent>
        </Card>
    </motion.div>
);