# 🔍 Google Forms Entry ID Debug Guide

## Current Status ✅❌
Based on your test, here's what's working and what needs to be fixed:

- ✅ **Name field**: `entry.847057752` - WORKING
- ✅ **Email field**: `entry.508055351` - WORKING  
- ✅ **Zip field**: `entry.832508456` - WORKING
- ❌ **Primary Interest dropdown**: `entry.1572710206` - WRONG ENTRY ID
- ❌ **Espresso machine radio**: `entry.1561535688` - WRONG ENTRY ID
- ✅ **Comments field**: `entry.1117044731` - WORKING

## 🛠️ How to Find Correct Entry IDs

### Step 1: Open Your Form Source
1. Go to: https://docs.google.com/forms/d/e/1FAIpQLSflEWC2sYiZ8lwPJtkgjq3X5Jjfcz-KENfeVQS7xDWG4J9TJg/viewform
2. Right-click anywhere on the page
3. Select "View Page Source"
4. Press `Ctrl+F` (or `Cmd+F` on Mac) to search

### Step 2: Find Entry IDs for Dropdown (Primary Interest)
1. Search for: `PRIMAR INTEREST` or `Training`
2. Look for a line that contains something like:
   ```
   ["PRIMAR INTEREST",null,0,[[1234567890,[[["Training - Learn espresso & latte art
   ```
3. The number after the `[` is your entry ID
4. It should look like: `entry.1234567890`

### Step 3: Find Entry IDs for Radio Buttons (Espresso Machine)
1. Search for: `espresso machine` or `Yes, I have`
2. Look for a line containing the radio button options
3. Find the entry ID similar to the dropdown method

### Step 4: Update the Code
Once you find the correct entry IDs, update them in `js/form-handler.js`:

```javascript
this.GOOGLE_FORM_ENTRIES = {
    name: 'entry.847057752',        // ✅ Keep this - working
    email: 'entry.508055351',       // ✅ Keep this - working
    zip: 'entry.832508456',         // ✅ Keep this - working
    interest: 'entry.YOUR_NEW_ID',  // ❌ Replace with correct ID
    espresso_machine: 'entry.YOUR_NEW_ID', // ❌ Replace with correct ID  
    comments: 'entry.1117044731'    // ✅ Keep this - working
};
```

## 🧪 Alternative Method: Form Inspection

If the source code method is difficult, try this:

### Method 1: Browser Developer Tools
1. Open your form
2. Press `F12` to open developer tools
3. Go to the "Network" tab
4. Fill out and submit the form once
5. Look for a request to `formResponse` 
6. Check the form data to see the actual entry IDs being sent

### Method 2: Form Builder Inspection  
1. Go to your form in edit mode
2. Click on each question
3. The URL might change to show the question ID
4. This can sometimes help identify the correct entry format

## 🎯 Quick Test After Update

After updating the entry IDs:

1. Open browser console (`F12`)
2. Run: `window.waitlistFormHandler.generateTestURL()`  
3. Open the generated URL
4. If all fields populate correctly, you're done! 🎉
5. If not, repeat the process for the fields that still show "The question has changed"

## 🔧 Troubleshooting Tips

### Common Issues:
1. **Entry ID format**: Make sure it's `entry.123456789` (no extra suffixes)
2. **Option text mismatch**: The dropdown/radio values must match exactly
3. **Question type changes**: If you modified questions after getting IDs, they might change
4. **Case sensitivity**: Option text is case-sensitive

### Form Option Values:
Make sure your form options match exactly:
- **Primary Interest**:
  - `"Training - Learn espresso & latte art"`
  - `"Events - Barista for gatherings"`  
  - `"Machine Help - Equipment maintenance"`
  - `"All services interest me"`

- **Espresso Machine**:
  - `"Yes, I have an espresso machine"`
  - `"No, but I'm interested in getting one"`
  - `"I'm considering purchasing one"`

## 📞 Need Help?

If you're still stuck:
1. Share the entry IDs you found in the source code
2. Let me know if any specific steps aren't working
3. Run the test URL generator again after updates

The form is almost working perfectly - just need those two entry IDs corrected! 🚀