struct person {
  char name[20];
  char gender;
  char age;
  int prevlogin;
}


int
main()
{
  struct person a = { "Wallace Gibbon", 1, 27, 1512726824 };

  return 0;
}
