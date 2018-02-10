var timelineData;

$(document).ready(function() {
	$.get("/timeline.json", function(data) {
		timelineData = data;

		$(".timeline-loading").addClass("hidden");
		$(".timeline-line").removeClass("hidden");

		var top = false;
		timelineData.items.forEach(function(timelineItem) {
			var $timelineItem = $('<div class="timeline-item"></div>');

				if (top) {
					$timelineItem.addClass("top");
				}
			
				$timelineItem.css({
					left: timelineItem.offset + "px"
				});

				var $timelineItemClickTarget = $('<div class="timeline-item-click-target"></div>');
					$timelineItemClickTarget.click(function() {
						var clickedAgain = ($(".timeline-item.details")[0] == $(this).parent()[0]);
						$(".timeline-item.details").removeClass("details");
						if (!clickedAgain) {
							$(this).parent().addClass("details");
						}
					});

					var $timelineItemLine = $('<div class="timeline-item-line"></div>');
					$timelineItemClickTarget.append($timelineItemLine);

				var $timelineItemSubtext = $('<div class="timeline-item-subtext"></div>');
					var $subtextDate = $('<div class="timeline-item-subtext-date"></div>');
						$subtextDate.text(timelineItem.date);
					$timelineItemSubtext.append($subtextDate);
					var $subtextTitle = $('<div class="timeline-item-subtext-title"></div>');
						$subtextTitle.text(timelineItem.title);
					$timelineItemSubtext.append($subtextTitle);
					var $subtextDetails = $('<div class="timeline-item-subtext-details"></div>');
						var $detailsText = $('<div class="details-text"></div>');
							$detailsText.text(timelineItem.blurb.description);
						$subtextDetails.append($detailsText);
						var $detailsDate = $('<div class="details-date"></div>');
							$detailsDate.text(timelineItem.blurb.date);
						$subtextDetails.append($detailsDate);
					$timelineItemSubtext.append($subtextDetails);

				$timelineItem.append($timelineItemClickTarget);
				$timelineItem.append($timelineItemSubtext);

			$(".timeline-line").append($timelineItem);

			top = !top;
		});
	});
});