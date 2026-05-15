'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface KizunaProject {
    id: string;
    name: string;
    slogan: string;
    industry: string[];
    vision: string;
    currentStep: number; // 1 to 4
    completionPercentage: number; // Mapping: Step 1=25%, Step 2=50%, Step 3=75%, Step 4=100%
    status: "Draft" | "Processing" | "Completed";
    lastUpdated: string;
}

const defaultProject: KizunaProject = {
    id: 'proj-' + Math.random().toString(36).substr(2, 9),
    name: '',
    slogan: '',
    industry: [],
    vision: '',
    currentStep: 1,
    completionPercentage: 0,
    status: 'Draft',
    lastUpdated: new Date().toISOString(),
};

interface ProjectContextProps {
    project: KizunaProject;
    setProject: React.Dispatch<React.SetStateAction<KizunaProject>>;
    updateProject: (data: Partial<KizunaProject>) => void;
    updateFromWizardStep: (stepIndex: number, formData: any) => void;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<KizunaProject>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('kizuna_project');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error("Failed to parse project from local storage", e);
                }
            }
        }
        return defaultProject;
    });

    useEffect(() => {
        localStorage.setItem('kizuna_project', JSON.stringify(project));
    }, [project]);

    const updateProject = (data: Partial<KizunaProject>) => {
        setProject((prev) => ({
            ...prev,
            ...data,
            lastUpdated: new Date().toISOString(),
        }));
    };

    const updateFromWizardStep = (stepIndex: number, formData: any) => {
        const currentStep = stepIndex + 1; // Map 0-3 to 1-4
        let updates: Partial<KizunaProject> = { currentStep };

        if (currentStep === 1) {
            // Step 1: Updates name, slogan, sets completion to 25%
            updates.name = formData.projectName || '';
            updates.slogan = formData.slogan || '';
            // We also update industry if available
            if (formData.category) {
                updates.industry = [formData.category];
            }
            updates.completionPercentage = 25;
        } else if (currentStep === 2) {
            // Step 2: Updates vision, sets completion to 50%
            updates.vision = formData.problem || ''; // mapping problem/solution as vision, or use formData.vision if available
            updates.completionPercentage = 50;
        } else if (currentStep === 3) {
            // Step 3: Sets completion to 75%
            updates.completionPercentage = 75;
        } else if (currentStep === 4) {
            // Step 4: Sets completion to 100%, status to Completed
            updates.completionPercentage = 100;
            updates.status = 'Completed';
        }

        if (currentStep < 4 && project.status !== 'Completed') {
            updates.status = (updates.completionPercentage && updates.completionPercentage < 100) ? 'Processing' : 'Completed';
        }

        updateProject(updates);
    };

    return (
        <ProjectContext.Provider value={{ project, setProject, updateProject, updateFromWizardStep }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
