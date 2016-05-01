#!/usr/bin/env perl
use IO::All;
use 5.14.0;

my @files = io->file('CHAT_FILES')->slurp;
my $io = io("../app/");
my @all_files = $io->All;
my @selected_files;
my $template_dir = "lib/generators/actionchat/templates";
for (@files) {
  chomp(my $filename = $_);
  push @selected_files, grep(m/$filename/, @all_files);
}
for (@selected_files) {
  chomp(my $file = $_);
  my $new_file = $file;
  $new_file =~ s/app/$template_dir/;
  say "Copying " . $file . " to " . $new_file;
  io($file)->copy($new_file);
}
