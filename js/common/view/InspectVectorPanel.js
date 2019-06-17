// Copyright 2019, University of Colorado Boulder

/**
 * Shows a Scenery Node that display the numerical magnitude, angle and components of a vector
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const Panel = require( 'SUN/Panel' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Range = require( 'DOT/Range' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const Text = require( 'SCENERY/nodes/Text' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );


  // constants
  const VECTOR_PANEL_OPTIONS = {
    expandedProperty: new BooleanProperty( false ), // {Property.<boolean>}
    yMargin: 12,
    cornerRadius: 5,
    minWidth: 430,
    resize: false,
    fill: VectorAdditionColors.INSPECT_VECTOR_BACKGROUND,
    stroke: VectorAdditionColors.INSPECT_VECTOR_BORDER_COLOR
  };

  const EXPAND_COLLAPSE_BUTTON_CENTER_Y = -9;
  const EXPAND_COLLAPSE_BUTTON_LEFT_MARGIN = 5;
  const INSPECT_VECTOR_TEXT_LEFT_MARGIN = 10;

  // strings
  const selectAVectorString = require( 'string!VECTOR_ADDITION/selectAVector' );
  const inspectAVectorString = require( 'string!VECTOR_ADDITION/inspectAVector' );
  const xString = require( 'string!VECTOR_ADDITION/x' );
  const yString = require( 'string!VECTOR_ADDITION/y' );


  class InspectVectorPanel extends Panel {

    /**
     * @param {array.<VectorSet>} vectorSets
     */
    constructor( vectorSets ) {

      // node that is passed to the superclass (panel)
      const contentNode = new Node();

      // create a button node to collapse/expand the panel
      const expandCollapseButton = new ExpandCollapseButton( VECTOR_PANEL_OPTIONS.expandedProperty, {
        sideLength: 21
      } );

      const inspectVectorText = new Text( inspectAVectorString, { font: new PhetFont( 16 ) } );

      const selectVectorText = new Text( selectAVectorString, { font: new PhetFont( 16 ) } );

      // create a scenery node that contains the nodes that display the vector
      // attributes (i.e. magnitude, angle, x and y components)
      const displayVectorNode = new LayoutBox( {
        spacing: 15,
        orientation: 'horizontal',
        children: [ selectVectorText ]
      } );

      // layout the scenery nodes
      expandCollapseButton.left = EXPAND_COLLAPSE_BUTTON_LEFT_MARGIN;
      expandCollapseButton.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
      inspectVectorText.left = expandCollapseButton.right + INSPECT_VECTOR_TEXT_LEFT_MARGIN;
      inspectVectorText.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
      selectVectorText.left = inspectVectorText.left;
      selectVectorText.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
      displayVectorNode.left = inspectVectorText.left;
      displayVectorNode.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;

      // set the children of the content node to be passed to the super class
      contentNode.setChildren( [
        expandCollapseButton,
        inspectVectorText,
        displayVectorNode
      ] );


      super( contentNode, VECTOR_PANEL_OPTIONS );

      // @private {LayoutBox} displayVectorNode - create a reference to the layout box
      this.displayVectorNode = displayVectorNode;

      // expand/collapse
      const expandedObserver = ( expanded ) => {
        displayVectorNode.visible = expanded;
        inspectVectorText.visible = !expanded;
        // TODO: toggle the selectVectorText visibility
      };


      VECTOR_PANEL_OPTIONS.expandedProperty.link( expandedObserver );

      const isDraggingListener = ( isDragging, vectorModel ) => {
        if ( isDragging ) {

          const magnitudeTextNode = new FormulaNode( `\|\\mathbf{\\vec{${vectorModel.label}\}\}|` );
          const magnitudeDisplay = new NumberDisplay(
            vectorModel.magnitudeProperty,
            new Range( 0, 100 ),
            { decimalPlaces: 1 }
          );

          const angleText = new RichText( MathSymbols.THETA );
          const angleDisplay = new NumberDisplay(
            vectorModel.angleDegreesProperty,
            new Range( -180, 180 ),
            { decimalPlaces: 1 }
          );

          const xComponentText = new RichText( `${vectorModel.label}<sub>${xString}</sub>` );
          const xComponentDisplay = new NumberDisplay(
            vectorModel.xComponentProperty,
            new Range( -60, 60 ),
            { decimalPlaces: 0 }
          );

          const yComponentText = new RichText( `${vectorModel.label}<sub>${yString}</sub>` );
          const yComponentDisplay = new NumberDisplay(
            vectorModel.yComponentProperty,
            new Range( -40, 40 ),
            { decimalPlaces: 0 }
          );

          this.displayVectorNode.setChildren( [
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ magnitudeTextNode, magnitudeDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ angleText, angleDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ xComponentText, xComponentDisplay ]
            } ),
            new LayoutBox( {
              orientation: 'horizontal',
              spacing: 8,
              children: [ yComponentText, yComponentDisplay ]
            } )
          ] );

          this.displayVectorNode.centerY = EXPAND_COLLAPSE_BUTTON_CENTER_Y;
        }
      };


      vectorSets.forEach( ( vectorSet ) => {

        const isVectorSumDraggingListener = ( isDragging ) => {
          isDraggingListener( isDragging, vectorSet.vectorSum );
        };

        vectorSet.vectorSum.isDraggingProperty.link( isVectorSumDraggingListener );

        vectorSet.vectors.addItemAddedListener( ( addedVector ) => {


          const isDragListener = ( isDragging ) => {
            isDraggingListener( isDragging, addedVector );
          };
          addedVector.isDraggingProperty.link( isDragListener );

          vectorSet.vectors.addItemRemovedListener( ( removedVector ) => {
            if ( removedVector === addedVector ) {
              removedVector.isDraggingProperty.unlink( isDragListener );
            }
          } );
        } );
      } );
    }
  }


  return vectorAddition.register( 'InspectVectorPanel', InspectVectorPanel );
} );

