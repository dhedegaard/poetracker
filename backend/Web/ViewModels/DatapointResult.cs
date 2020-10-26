using Core.Models;
using System;

namespace Web.ViewModels {
    public class DatapointResult {
        public Datapoint Datapoint { get; set; }
        public Datapoint PreviousDatapoint { get; set; }
    }
}
