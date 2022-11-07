from flask import Flask, render_template, request, jsonify
import nltk
import pickle
from nltk.corpus import stopwords
import re
from nltk.stem.porter import PorterStemmer

app = Flask(__name__)
ps = PorterStemmer()

model = pickle.load(open('Model/logreg_fakenews.pickle', 'rb'))
tfidfvect = pickle.load(open('Model/tfidf.pickle', 'rb'))

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

def predict(text, title, author):
    content = title + ' ' + author + ' ' + text 
    print(content)
    review = re.sub('[^a-zA-Z]', ' ', content)
    review = review.lower()
    review = review.split()
    review = [ps.stem(word) for word in review if not word in stopwords.words('english')]
    review = ' '.join(review)

    review_vect = tfidfvect.transform([review]).toarray()
    prediction = 'giả' if model.predict(review_vect)[0] == 0 else 'thật'
    print(model.predict(review_vect))
    return prediction

@app.route('/', methods=['POST'])
def webapp():
    text = request.form['textInput']
    author = request.form['authorInput']
    title = request.form['titleInput']
    prediction = predict(text, title, author)
    return render_template('index.html', textInput=text, result=prediction)


@app.route('/predict/', methods=['GET','POST'])
def api():
    text = request.args.get("text")
    prediction = predict(text)
    return jsonify(prediction=prediction)

if __name__ == "__main__":
    app.run()