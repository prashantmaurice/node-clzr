#include<opencv2/opencv.hpp>
#include<iostream>

using namespace cv;
using namespace std;

int main(int argc, char** argv) {
	Mat img_gray = imread(argv[1], CV_LOAD_IMAGE_GRAYSCALE);
	if(!img_gray.data) {
		cout<<"Error opening the file";
		return -1;
	}
	namedWindow("img_gray",WINDOW_AUTOSIZE);
	imgshow("img_gray",img_gray);
	waitKey(0);
	destroyWindow("img_gray");
	return 0;
}