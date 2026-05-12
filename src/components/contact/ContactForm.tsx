'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { MimooBlob } from '@/lib/avatar/MimooBlob';

interface ContactFormProps {
  labels: {
    title: string;
    description: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    category: string;
    categoryOptions: {
      general: string;
      support: string;
      partnership: string;
      feedback: string;
      press: string;
      other: string;
    };
    message: string;
    messagePlaceholder: string;
    submit: string;
    cancel: string;
    successTitle: string;
    successDesc: string;
    errorMessage: string;
  };
}

/**
 * Contact form with mailto: fallback.
 * MVP: opens user's email client with pre-filled message.
 * Future: integrate with Resend / form backend.
 */
export function ContactForm({ labels }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Build mailto link
    const categoryLabel =
      labels.categoryOptions[formData.category as keyof typeof labels.categoryOptions];
    const body = `Halo Mimoo team,\n\n${formData.message}\n\n—\nDari: ${formData.name}\nEmail: ${formData.email}\nKategori: ${categoryLabel}`;
    const targetEmail =
      formData.category === 'support'
        ? 'support@mimoo.id'
        : formData.category === 'partnership'
        ? 'partner@mimoo.id'
        : formData.category === 'press'
        ? 'press@mimoo.id'
        : 'hello@mimoo.id';

    const mailto = `mailto:${targetEmail}?subject=${encodeURIComponent(
      `[${categoryLabel}] ${formData.subject}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <MimooBlob size="xl" expression="love" />
        </div>
        <div className="text-4xl mb-3" aria-hidden="true">
          💜
        </div>
        <h3 className="font-display text-xl font-bold text-mimoo-ink-900 mb-2">
          {labels.successTitle}
        </h3>
        <p className="text-mimoo-ink-500 leading-relaxed mb-6 max-w-md mx-auto">
          {labels.successDesc}
        </p>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              subject: '',
              category: 'general',
              message: '',
            });
            setSubmitted(false);
          }}
        >
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          type="text"
          name="name"
          label={labels.name}
          placeholder={labels.namePlaceholder}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          name="email"
          label={labels.email}
          placeholder={labels.emailPlaceholder}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-semibold text-mimoo-ink-700 mb-1.5"
        >
          {labels.category}
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full bg-white rounded-cozy border-2 border-mimoo-purple-100 px-4 py-3 text-mimoo-ink-900 focus:outline-none focus:border-mimoo-purple-400 focus:ring-4 focus:ring-mimoo-purple-100 transition-all"
        >
          <option value="general">{labels.categoryOptions.general}</option>
          <option value="support">{labels.categoryOptions.support}</option>
          <option value="partnership">{labels.categoryOptions.partnership}</option>
          <option value="feedback">{labels.categoryOptions.feedback}</option>
          <option value="press">{labels.categoryOptions.press}</option>
          <option value="other">{labels.categoryOptions.other}</option>
        </select>
      </div>

      <Input
        type="text"
        name="subject"
        label={labels.subject}
        placeholder={labels.subjectPlaceholder}
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
      />

      <Textarea
        name="message"
        label={labels.message}
        placeholder={labels.messagePlaceholder}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={5}
        required
      />

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {labels.submit}
      </Button>
    </form>
  );
}
