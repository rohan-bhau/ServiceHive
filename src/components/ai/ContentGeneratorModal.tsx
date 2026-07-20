'use client';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import { showToast } from '@/lib/utils';

import { useGenerateListingMutation } from '@/store/api/aiApi';

interface ContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUse: (shortDescription: string, fullDescription: string) => void;
}

export default function ContentGeneratorModal({ isOpen, onClose, onUse }: ContentGeneratorModalProps) {
  const [bullets, setBullets] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [result, setResult] = useState<{ shortDescription: string; fullDescription: string } | null>(null);

  const [generateListing, { isLoading }] = useGenerateListingMutation();

  const handleGenerate = async () => {
    if (!bullets.trim()) {
      showToast.error('Please enter some bullet points');
      return;
    }
    setResult(null);
    try {
      const data = await generateListing({ bullets, tone, length }).unwrap();
      setResult(data);
    } catch {
      showToast.error('Failed to generate content');
    }
  };

  const handleUse = () => {
    if (result) {
      onUse(result.shortDescription, result.fullDescription);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate with AI">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Describe your service in bullet points</label>
          <textarea
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="math tutoring, grade 9-12, 5 yrs experience, online + in-person"
          />
        </div>
        <div className="flex gap-4">
          <Select
            label="Tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            options={[
              { value: 'professional', label: 'Professional' },
              { value: 'friendly', label: 'Friendly' },
              { value: 'persuasive', label: 'Persuasive' },
            ]}
          />
          <Select
            label="Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            options={[
              { value: 'short', label: 'Short' },
              { value: 'medium', label: 'Medium' },
              { value: 'long', label: 'Long' },
            ]}
          />
        </div>
        <Button onClick={handleGenerate} loading={isLoading} className="w-full">
          Generate
        </Button>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton height="60px" />
            <Skeleton height="100px" />
          </div>
        )}
        {result && (
          <div className="space-y-3 rounded-xl border p-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Short Description</label>
              <p className="text-sm text-gray-900">{result.shortDescription}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Full Description</label>
              <p className="text-sm text-gray-900">{result.fullDescription}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerate}>
                Regenerate
              </Button>
              <Button onClick={handleUse}>Use These</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
