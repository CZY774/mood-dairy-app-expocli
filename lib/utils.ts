export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (formatDate(date) === formatDate(today)) {
    return 'Hari ini';
  } else if (formatDate(date) === formatDate(yesterday)) {
    return 'Kemarin';
  } else {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export const getDateRangeForWeek = (weeksAgo: number = 0): { start: string; end: string } => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() - (weeksAgo * 7));
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    start: formatDate(startOfWeek),
    end: formatDate(endOfWeek)
  };
};

export const generateWeekDates = (startDate: string): string[] => {
  const dates = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const getMoodColor = (mood: number): string => {
  const colors = {
    1: '#FF6B6B',
    2: '#FFA07A', 
    3: '#FFD93D',
    4: '#6BCF7F',
    5: '#4ECDC4'
  };
  return colors[mood as keyof typeof colors] || '#FFD93D';
};

export const generatePDFContent = (entries: any[]): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .entry { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .date { font-weight: bold; color: #333; }
          .mood { font-size: 18px; margin: 10px 0; }
          .activities { margin: 10px 0; }
          .notes { font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📖 Mood Diary Export</h1>
          <p>Generated on ${new Date().toLocaleDateString('id-ID')}</p>
        </div>
        ${entries.map(entry => `
          <div class="entry">
            <div class="date">${formatDisplayDate(entry.date)}</div>
            <div class="mood">${entry.moodEmoji} Mood: ${entry.mood}/5</div>
            <div class="activities">
              <strong>Aktivitas:</strong> ${JSON.parse(entry.activities).join(', ')}
            </div>
            ${entry.notes ? `<div class="notes">"${entry.notes}"</div>` : ''}
          </div>
        `).join('')}
      </body>
    </html>
  `;
};