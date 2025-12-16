// Copyright 2025, University of Colorado Boulder

/**
 * EquationsGraphAreaHeading is a 'Graph Area' heading for the Equations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';

export default class EquationsGraphAreaHeading extends Node {

  public constructor( graphNode: Node,
                      vectorSetNodesParent: Node,
                      visibleProperty: TReadOnlyProperty<boolean>,
                      resultantVectorVisibleProperty: TReadOnlyProperty<boolean>,
                      baseVectorsVisibleProperty: TReadOnlyProperty<boolean>,
                      vectorSet: EquationsVectorSet ) {
    super( {
      visibleProperty: visibleProperty,
      pdomOrder: [
        graphNode,
        vectorSetNodesParent
      ],
      accessibleHeading: VectorAdditionStrings.a11y.accessibleHeadings.graphAreaHeadingStringProperty,
      accessibleParagraph: new PatternStringProperty( VectorAdditionStrings.a11y.graphArea.accessibleParagraphEquationsStringProperty, {
        numberOfVectors: new DerivedProperty(
          [ resultantVectorVisibleProperty,
            baseVectorsVisibleProperty,
            vectorSet.numberOfVectorsOnGraphProperty
          ],
          ( resultantVectorVisible, baseVectorsVisible, numberOfVectorsOnGraph ) => {

            // This includes vectors a & b (or d & e) which are always visible.
            let totalNumberOfVectors = numberOfVectorsOnGraph;

            // Add the resultant vector (c or f) if it is visible and defined.
            // It will always be defined because there are always other vectors on the graph.
            if ( resultantVectorVisible ) {
              totalNumberOfVectors++;
            }

            // Add the base vectors if they are visible.
            if ( baseVectorsVisible ) {
              totalNumberOfVectors += vectorSet.baseVectors.length;
            }
            return totalNumberOfVectors;
          } )
      } )
    } );
  }
}

vectorAddition.register( 'EquationsGraphAreaHeading', EquationsGraphAreaHeading );