# DrawingBot

מערכת מבוססת React ו־.NET Core ליצירת ציורים לפי פקודות שפה טבעית, כולל שמירת ציורים, הצגת תמונות קודמות של המשתמש, שמירת היסטוריית פעולות והורדת ציור כקובץ. המערכת כוללת אינטגרציה עם מודל שפה לצורך תרגום הפרומפט לפקודות ציור.

## 🛠 טכנולוגיות

- **Frontend**: React, TypeScript, React Hook Form, CSS מותאם, Canvas API  
- **Backend**: ASP.NET Core Web API  
- **DB Models**: `User`, `Image`, `Drawing`  
- **שפות תכנות**: TypeScript, C#  
- **אחסון**: שרת מקומי + שליפת קבצים מהשרת

## 🎨 פיצ'רים עיקריים

- תיבת שיחה עם בוט המזהה פקודות שפה טבעית ומחזיר ציור תואם  
- ציור על גבי קנבס לפי פקודות מתורגמות (למשל: "צייר בית")  
- תמיכה ב־4 סוגי צורות בלבד: `circle`, `rectangle`, `triangle`, `line`  
- תצוגת גלריה של תמונות שנשמרו על ידי המשתמש  
- אפשרות טעינה של תמונה קיימת וציור מעליה  
- שילוב רכיב לבחירת תמונה לפני התחלת הציור  
- **אפשרות הורדת הציור כקובץ תמונה (PNG)**  
- **שמירת היסטוריית פקודות ציור לכל ציור**

## 🧠 לוגיקת ציור

- כל פרומפט מתורגם למבנה JSON אחיד של צורות  
- רק הציור הדרוש לפריט הספציפי מבוצע (לא סצנה שלמה)  

## 📦 התקנה והרצה

```bash
git clone https://github.com/Yael380/Drawing-bot
cd Drawing-bot

# התקנת צד לקוח
cd bot-client
npm install
npm start

# התקנת צד שרת
cd ../bot-server
dotnet build
dotnet run
